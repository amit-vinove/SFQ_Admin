import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";

import { Subject, of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";

import { AccountSettingsService } from "app/main/pages/account-settings/account-settings.service";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthenticationService } from "app/auth/service";
import { User } from "app/auth/models";
class ProfileImage {
  constructor(public src: string, public file: File | null) { }
}
@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  public accountForm: FormGroup;
  public changePasswordForm: FormGroup;
  public changepassEmail: any;
  public loading = false;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService, private _formBuilder: FormBuilder, private router: Router, private _authenticationService: AuthenticationService) {
    this._unsubscribeAll = new Subject();
    this.accountForm = this._formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      phone: [""],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50)]],
      profileImage: [new ProfileImage("", null)],
    });
    this.changePasswordForm = this._formBuilder.group(
      {
        email: [this.changepassEmail],
        oldPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.confirmPasswordValidator.bind(this) }
    );
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  processProfileImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event: any) => {
      if (file.size > 1000) {
        this.accountForm.patchValue({
          profileImage: new ProfileImage(event.target.result, file),
        });
        this.accountForm.markAsDirty();
        this.accountForm.markAsTouched();
        this.accountForm.updateValueAndValidity();
      } else {
        Swal.fire({
          text: "error",
        });
      }
    });

    reader.readAsDataURL(file);
  }

  get profileImage(): ProfileImage {
    return this.accountForm.value.profileImage;
  }

  removeProfileImage() {
    const profileImage = this.accountForm.value.profileImage;
    if (profileImage && profileImage?.src) {
      this.accountForm.patchValue({
        profileImage: new ProfileImage("", null),
      });
      this.accountForm.markAsDirty();
      this.accountForm.markAsTouched();
      this.accountForm.updateValueAndValidity();
    }
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.getEmail();
    this._accountSettingsService.getUser().then((res) => {
      if (res) {
        this.accountForm.patchValue({
          firstName: res?.data?.firstname,
          lastName: res?.data?.lastname,
          email: res?.data?.email,
          phone: res?.data?.mobileNo,
          profileImage: new ProfileImage(res?.data?.logo, null),
        });
      }
    });
    this._accountSettingsService.onSettingsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.data = response;
      // this.avatarImage = this.data.accountSetting.general.avatar;
    });

    // content header
    this.contentHeader = {
      headerTitle: "Account Settings",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Pages",
            isLink: true,
            link: "/",
          },
          {
            name: "Account Settings",
            isLink: false,
          },
        ],
      },
    };
  }

  get firstName(): AbstractControl | null {
    return this.accountForm.get("firstName");
  }
  get lastName(): AbstractControl | null {
    return this.accountForm.get("lastName");
  }
  get phone(): AbstractControl | null {
    return this.accountForm.get("phone");
  }
  get email(): AbstractControl | null {
    return this.accountForm.get("email");
  }
  get oldPassword(): AbstractControl | null {
    return this.changePasswordForm.get("oldPassword");
  }
  get newPassword(): AbstractControl | null {
    return this.changePasswordForm.get("newPassword");
  }
  get confirmPassword(): AbstractControl | null {
    return this.changePasswordForm.get("confirmPassword");
  }
  onSubmit() {
    if (this.accountForm.pristine) {
      Swal.fire("No changes updated!");
    } else if (this.accountForm.valid) {
      const data = {
        UserId: this._accountSettingsService.user.id,
        firstName: this.accountForm.value.firstName,
        lastName: this.accountForm.value.lastName,
        mobileNo: this.accountForm.value.phone,
        email: this.accountForm.value.email,

        logo: this.profileImage?.src,
      };
      this._accountSettingsService.updateUser(data).then((res) => {
        if (res) {
          if (res.statusCode == "200") {
            this.accountForm.markAsPristine();

            const user: User = {
              id: data.UserId,
              email: data.email,
              password: "",
              firstName: data.firstName,
              lastName: data.lastName,
              fullName: data.firstName + " " + data.lastName,
              logo: data.logo,
              role: 1,
            };
            // this._accountSettingsService.getUser().then((res) => { });
            this._authenticationService.updateCurrentUser(user);

            Swal.fire({
              title: "",
              text: res.message,
            });
          } else {
            Swal.fire({
              title: "",
              text: res.message,
            });
          }
        } else {
          Swal.fire({
            title: "",
            text: res.message,
          });
        }
      });
    }
  }

  changePassword() {
    this.loading = true;

    const data = {
      email: this.changepassEmail,
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmPassword,
    };
    if (this.changePasswordForm.pristine) {
      Swal.fire("No changes updated!");
    } else if (this.changePasswordForm.valid) {
      this._accountSettingsService.changePassword(data).then((res) => {


        if (res) {
          if (res.statusCode == "200") {
            this.loading = false;
            this.changePasswordForm.markAsPristine();

            Swal.fire({
              title: "",
              text: res.message,
            });
          } else {
            Swal.fire({
              title: "",
              text: res.message,
            }).then(() => {
              this.loading = false;
            });
          }
        } else {
          Swal.fire({
            title: "",
            text: res.message,
          }).then(() => {
            this.loading = false;
          });
        }
      });
    }
  }

  getEmail() {
    const data = localStorage.getItem("currentUser");
    this.changepassEmail = JSON.parse(data || "{}").email;
  }

  confirmPasswordValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get("newPassword")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { passwordsNotMatching: true };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
