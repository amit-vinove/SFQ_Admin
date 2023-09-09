import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { FoodSupplierService } from 'app/main/apps/food-supplier/food-supplier/food-supplier.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-food-supplier',
  templateUrl: './food-supplier.component.html',
  styleUrls: ['./food-supplier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FoodSupplierComponent implements OnInit {

  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public pagesize: number = 10;
  public pageNumber: number = 1;

  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";

  public selectStatus: any = [
    { name: "All", value: "all" },
    { name: "Active", value: "true" },
    { name: "Inactive", value: "false" },
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = "";

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _coreConfigService: CoreConfigService, private _foodSupplierService: FoodSupplierService) {
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
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d?.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

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
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {

    const filter = event ? event.value : "";
    this.temp = this.filterRows(filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   *
   *
   * @param statusFilter
   */
  filterRows(statusFilter): any[] {
    this.searchValue = "";
    if (statusFilter == "all" || statusFilter == "") {
      return this.tempData;
    } else if (statusFilter == "true") {
      return this.tempData.filter((row) => row.accountStatus == true);
    } else if (statusFilter == "false") {
      return this.tempData.filter((row) => row.accountStatus == false);
    }
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      if (config.layout.animation === "zoomIn") {
        setTimeout(() => {
          this.getSupplierList();
        }, 450);
      } else {
        this.getSupplierList();
      }
    });
  }

  getSupplierList() {


    this._foodSupplierService.getSupplierList(this.pageNumber, this.pagesize).then((response: any) => {

      this.rows = response.data;
      this.tempData = this.rows;

    });
  }



  downloadFile(format: any) {
    this._foodSupplierService.exportFile(format, this.pageNumber, this.pagesize).subscribe((response: any) => {
      const blob: Blob = response.body as Blob;
      if (format === 'pdf') {
        const downloadFileAnchorElement = document.createElement('a');
        if (downloadFileAnchorElement) {
          downloadFileAnchorElement.download = 'UserList.' + format;
          downloadFileAnchorElement.href = window.URL.createObjectURL(blob);
          downloadFileAnchorElement.click();
        }
      }
      else {
        const downloadFileAnchorElement = document.createElement('a');
        if (downloadFileAnchorElement) {
          downloadFileAnchorElement.download = 'UserList.' + format;
          downloadFileAnchorElement.href = window.URL.createObjectURL(blob);
          downloadFileAnchorElement.click();
        }
      }
      Swal.fire(
        response.message,
        'success'
      )
    })
  }


  onChangePageSize() {

    this.getSupplierList();

  }

  deleteSupplier(id) {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {

        this._foodSupplierService.deleteSupplier(id).then((response: any) => {
          if (response.statusCode == 200) {
            this.getSupplierList();
            Swal.fire(
              'Deleted!',
              'success'
            )
          }
          else {
            Swal.fire(
              'User Not Deleted!',
              'error'
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
        )
      }
    })
  }

  statusUpdate(row: { id: number, subscriptionStatus: boolean }) {

    const activeStatus = !row.subscriptionStatus;
    const methodName = activeStatus ? "SubscriptionStatusActive" : "SubscriptionStatusInActive";

    this._foodSupplierService.statusUpdate(row.id, methodName).then((response: any) => {
      if (response.statusCode == 200) {
        this.getSupplierList();
        Swal.fire(
          {
            title: '',
            text: "Status updated successfully!"
          }
        )
      }

    });
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
