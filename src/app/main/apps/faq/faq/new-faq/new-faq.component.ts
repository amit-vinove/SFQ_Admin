import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FaqService } from '../faq.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
  selector: 'app-new-faq',
  templateUrl: './new-faq.component.html',
  styleUrls: ['./new-faq.component.scss']
})
export class NewFaqComponent implements OnInit {

  public faqForm: FormGroup;
  public editMode: boolean
  public editFAQId: any
  public pagesize: number = 10;
  public pageNumber: number = 1;
  public pages: any = []

  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private _faqService: FaqService,
    private _formBuilder: FormBuilder, private router: Router) {
    this.faqForm = this._formBuilder.group({
      id: [''],
      question: ['', [Validators.required, Validators.maxLength(100)]],
      answer: ['', [Validators.required, Validators.maxLength(100)]],
      page: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._faqService.getFaqPages().then((response: any) => {
      if (response && response.statusCode == 200) {
        this.pages = response.data
      }
    })
    this._faqService.castFaqId.subscribe((response: any) => {
      if (response !== '') {
        this.editFAQId = response
      }
    })
    this._faqService.castEditFAQMode.subscribe((response: any) => {
      this.editMode = response
      if (this.editMode) {
        this._faqService.getFAQbyId(this.editFAQId).then((response: any) => {
          this.faqForm.patchValue(response.data)
        })
      }
    })

  }
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
    if (this.faqForm.valid) {

      if (this.editMode) {
        const data = {
          id: this.faqForm.value.id,
          question: this.faqForm.value.question,
          answer: this.faqForm.value.answer,
          page: this.faqForm.value.page,
        }
        this._faqService.editFaQ(data).then((response: any) => {
          if (response && response.statusCode == 200) {
            Swal.fire('Success!', 'FAQ Updated successfully!', 'success');
            this.faqForm.reset();
            this.toggleSidebar('new-user-sidebar');
            this._faqService.getFAQList(this.pageNumber, this.pagesize).then((response: any) => {
              if (response && response.statusCode == 200) {
                this._faqService.faqList.next(response.data);
              }
            })
            this._faqService.editFAQMode.next(false)
          } else {
            Swal.fire('Oops!', 'Something went wrong!', 'error');
          }
        })
      }

      else {
        const data = {
          question: this.faqForm.value.question,
          answer: this.faqForm.value.answer,
          page: this.faqForm.value.page,
        }
        this._faqService.saveFaQ(data).then((response: any) => {
          if (response && response.statusCode == 200) {
            Swal.fire('Success!', 'FAQ added successfully!', 'success');
            this.faqForm.reset();
            this.toggleSidebar('new-user-sidebar');
            this._faqService.getFAQList(this.pageNumber, this.pagesize).then((response: any) => {
              if (response && response.statusCode == 200) {
                this._faqService.faqList.next(response.data);
              }
            })
          } else {
            Swal.fire('Oops!', 'Something went wrong!', 'error');
          }
        })
      }
    }
  }


  get question(): AbstractControl | null {
    return this.faqForm.get('question');
  }

  get answer(): AbstractControl | null {
    return this.faqForm.get('answer');
  }

  get page(): AbstractControl | null {
    return this.faqForm.get('page');
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();
  }

}

