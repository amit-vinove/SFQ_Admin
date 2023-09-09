import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { SubscriptionService } from './subscription.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionComponent implements OnInit {

  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public pagesize: number = 10;
  public pageNumber: number = 1;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public selectPlan: any = [
    { name: 'All', value: '' },
    { name: 'Monthly', value: 'monthly' },
    { name: 'Quaterly', value: 'quaterly' },
    { name: 'Half Yearly', value: 'halfYearly' },
    { name: 'Yearly', value: 'yearly' },
  ];
  public selectValidity: any = [
    { name: 'All', value: '' },
    { name: '30 Days', value: '30' },
    { name: '90 Days', value: '90' },
    { name: '180 Days', value: '180' },
    { name: '1 Year', value: '360' },
  ];
  public selectPrice: any = [
    { name: 'All', value: '' },
    { name: '200', value: '200' },
    { name: '800', value: '800' },
    { name: '1200', value: '1200' },
    { name: '2200', value: '2200' },
  ];

  public selectOrder: any = [
    { name: 'All', value: '' },
    { name: 'A-Z', value: 'asc' },
    { name: 'Z-A', value: 'dsc' },
  ];

  public selectedPage = [];
  public selectedValidity = [];
  public selectedPrice = [];

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
    private _subscriptionService: SubscriptionService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _router: Router
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
  filterUpdate(event: any) {
    // Reset ng-select on search
    this.selectedPage = this.selectPlan[0];
    this.selectedOrder = this.selectOrder[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
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
  filterByPlan(event: any) {
    const filter = event ? event.value : '';
    this.temp = this.filterPlanRows(filter);
    this.rows = this.temp;
  }
  filterByValidity(event: any) {
    const filter = event ? event.value : '';
    this.temp = this.filterValidityRows(filter);
    this.rows = this.temp;
  }
  filterByPrice(event: any) {
    const filter = event ? event.value : '';
    this.temp = this.filterPriceRows(filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterPlanRows(statusFilter: any): any[] {
    this.searchValue = "";
    if (statusFilter == "all" || statusFilter == "") {
      return this.tempData;
    } else {
      return this.tempData?.filter((row) => row.name.toLowerCase() === statusFilter.toLowerCase());
    }
  }
  filterValidityRows(statusFilter: any): any[] {
    this.searchValue = "";
    if (statusFilter == "all" || statusFilter == "") {
      return this.tempData;
    } else {
      return this.tempData?.filter((row) => parseInt(row.validity) === parseInt(statusFilter));
    }
  }
  filterPriceRows(statusFilter: any): any[] {
    this.searchValue = "";
    if (statusFilter == "all" || statusFilter == "") {
      return this.tempData;
    } else {
      return this.tempData?.filter((row) => row.price === statusFilter);
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
          this.getSubscriptionList();
        }, 450);
      } else {
        this.getSubscriptionList();
      }
    });
  }

  getSubscriptionList() {
    this._subscriptionService.getSubscriptionsList().then((response: any) => {
      this._subscriptionService.subscriptionList.next(response.data);
    });
    this._subscriptionService.castSubscriptionList.subscribe((response: any) => {
      this.rows = response;
      this.tempData = this.rows;
    })
  }

  deleteSubscription(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this FAQ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',

    }).then((result) => {
      if (result.value) {
        this._subscriptionService.deleteSubscription(id).then((response: any) => {
          if (response.statusCode == 200) {
            Swal.fire(
              'Deleted!',
              'Your FAQ has been deleted.',
              'success'
            ).then((result) => {
              if (result.value) {
                this.getSubscriptionList();
              }
            });
          }
        });
      }
    });
  }

  addSubscription() {
    this._subscriptionService.editSubscriptionMode.next(false)
    this._router.navigate(['/apps/subscription/add-subscription']);
  }
  editSubscription(id: any) {
    this._subscriptionService.subscriptionId.next(id)
    this._subscriptionService.editSubscriptionMode.next(true)
    this._router.navigate(['/apps/subscription/add-subscription']);
  }

  statusUpdate(row: { id: number, isActive: boolean }) {
    const activeStatus = !row.isActive;
    const methodName = activeStatus ? "UserActiveStatus" : "UserInActiveStatus";

    // this._userService.statusUpdate(row.id, methodName).then((response: any) => {
    //   if (response.statusCode == 200) {
    //     Swal.fire(
    //       response.message,
    //       'success'
    //     )
    //   }
    //   else {
    //     Swal.fire(
    //       response.message,
    //       'error'
    //     )
    //   }
    // });
  }

  onChangePageSize() {
    this.getSubscriptionList();
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
