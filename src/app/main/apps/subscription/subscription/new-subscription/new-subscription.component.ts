import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { SubscriptionService } from '../subscription.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss']
})
export class NewSubscriptionComponent implements OnInit {

  public subscriptionForm: FormGroup;
  public editMode: boolean
  public editSubscriptionId: any

  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private _subscriptionService: SubscriptionService,
    private _formBuilder: FormBuilder, private router: Router) {
    this.subscriptionForm = this._formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      validity: ['', [Validators.required]],
      price: ['', [Validators.required]],
      enable: [false, [Validators.required]],
      benefits: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._subscriptionService.castSubscriptionId.subscribe((response: any) => {
      if (response !== '') {
        this.editSubscriptionId = response
        console.log(this.editSubscriptionId)
      }
    })
    this._subscriptionService.castEditSubscriptionMode.subscribe((response: any) => {
      this.editMode = response
      if (this.editMode) {
        this._subscriptionService.getSubscriptionbyId(this.editSubscriptionId).then((response: any) => {
          this.subscriptionForm.patchValue(response.data)
        })
      }
    })

  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      ['subscript'], ['superscript'], ['textColor'], ['backgroundColor'], ['customClasses'],
      ['insertImage'], ['insertVideo'], ['insertHorizontalRule'], ['removeFormat'], ['toggleEditorMode'],
      ['link'], ['unlink'], ['fontName'], ['heading'], ['fontSize']
    ],
  };

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit() {
    if (this.subscriptionForm.valid) {

      if (this.editMode) {
        const data = {
          id: parseInt(this.subscriptionForm.value.id),
          name: this.subscriptionForm.value.name,
          validity: this.subscriptionForm.value.validity,
          price: this.subscriptionForm.value.price,
          enable: this.subscriptionForm.value.enable,
          benefits: this.subscriptionForm.value.benefits[0],
        }
        this._subscriptionService.editSubscription(data).then((response: any) => {
          if (response && response.statusCode == 200) {
            Swal.fire('Success!', 'Subscription Updated successfully!', 'success');
            this.subscriptionForm.reset();
            this.router.navigate(['/apps/subscription/subscription'])
            this._subscriptionService.getSubscriptionsList().then((response: any) => {
              if (response && response.statusCode == 200) {
                this._subscriptionService.subscriptionList.next(response.data);
              }
            })
            this._subscriptionService.editSubscriptionMode.next(false)
          } else {
            Swal.fire('Oops!', 'Something went wrong!', 'error');
          }
        })
      }

      else {
        console.log(this.subscriptionForm)
        const data = {
          name: this.subscriptionForm.value.name,
          validity: this.subscriptionForm.value.validity,
          price: parseInt(this.subscriptionForm.value.price),
          benefits: this.subscriptionForm.value.benefits,
          enable: this.subscriptionForm.value.enable
        }
        this._subscriptionService.saveSubscription(data).then((response: any) => {
          if (response && response.statusCode == 200) {
            Swal.fire('Success!', 'Subscription added successfully!', 'success');
            this.subscriptionForm.reset();
            this.router.navigate(['/apps/subscription/subscription'])
            this._subscriptionService.getSubscriptionsList().then((response: any) => {
              if (response && response.statusCode == 200) {
                this._subscriptionService.subscriptionList.next(response.data);
              }
            })
          } else {
            Swal.fire('Oops!', 'Something went wrong!', 'error');
          }
        })
      }
    }
  }

  toggleStatus() {
    this.subscriptionForm.value.enable = !this.subscriptionForm.value.enable
  }

  get name(): AbstractControl | null {
    return this.subscriptionForm.get('name');
  }

  get validity(): AbstractControl | null {
    return this.subscriptionForm.get('validty');
  }

  get price(): AbstractControl | null {
    return this.subscriptionForm.get('price');
  }

}
