import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { FaqService } from './faq.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public pagesize: number = 10;
  public pageNumber: number = 1;

  public selectPage: any = [
    { name: 'All', value: '' },
    { name: 'Page 1', value: 'page1' },
    { name: 'Page 2', value: 'page2' },
    { name: 'Page 3', value: 'page3' },
    { name: 'Page 4', value: 'page4' },
  ];

  public selectOrder: any = [
    { name: 'All', value: '' },
    { name: 'A-Z', value: 'asc' },
    { name: 'Z-A', value: 'dsc' },
  ];

  public selectedPage = [];
  public selectedOrder = []
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _faqService: FaqService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedPage = this.selectPage[0];
    this.selectedOrder = this.selectOrder[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.page.toLowerCase().indexOf(val) !== -1 || d.question.toLowerCase().indexOf(val) !== -1 || d.answer.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
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
   * Filter By Roles
   *
   * @param event
   */
  filterByPage(event: any) {
    const filter = event ? event.value : '';
    this.temp = this.filterRows(filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(statusFilter: any): any[] {
    this.searchValue = "";
    if (statusFilter == "all" || statusFilter == "") {
      return this.tempData;
    } else {
      return this.tempData?.filter((row) => row.page.toLowerCase() === statusFilter.toLowerCase());
    }
  }

  sortData(event: any) {
    const order = event ? event.value : ''
    this.temp = this.descOrder(this.rows)
    this.rows = this.temp
  }

  ascOrder(data: any) {
    var sortedArray = data.sort(function (a, b) {
      return a.page - b.page
    })
    return sortedArray
  }

  descOrder(data: any) {
    var sortedArray = data.sort(function (a, b) {
      return b.page - a.page
    })
    return sortedArray
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      if (config.layout.animation === "zoomIn") {
        setTimeout(() => {
          this.getFAQList();
        }, 450);
      } else {
        this.getFAQList();
      }
    });
  }

  getFAQList() {
    this._faqService.getFAQList(this.pageNumber, this.pagesize).then((response: any) => {
      this._faqService.faqList.next(response.data);
    });
    this._faqService.castFaqList.subscribe((response: any) => {
      this.rows = response;
      this.tempData = this.rows;
    })
  }

  onChangePageSize() {
    this.getFAQList();
  }

  deleteFAQ(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this FAQ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',

    }).then((result) => {
      if (result.value) {
        this._faqService.deleteFAQ(id).then((response: any) => {
          if (response.statusCode == 200) {
            Swal.fire(
              'Deleted!',
              'Your FAQ has been deleted.',
              'success'
            ).then((result) => {
              if (result.value) {
                this.getFAQList();
              }
            });
          }
        });
      }
    });
  }

  addFAQ() {
    this._faqService.editFAQMode.next(false)
    this.toggleSidebar('new-user-sidebar');
  }
  editFAQ(id: any) {
    this._faqService.faqId.next(id)
    this._faqService.editFAQMode.next(true)
    this.toggleSidebar('new-user-sidebar');
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
