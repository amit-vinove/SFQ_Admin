import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';

import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReportsService } from './reports/reports.service';

// routing
const routes: Routes = [
  {
    path: "reports",
    component: ReportsComponent,

    data: { animation: "ReportsComponent" },
  },
];

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), CoreCommonModule, FormsModule, NgbModule, NgSelectModule, Ng2FlatpickrModule, NgxDatatableModule, CorePipesModule, CoreDirectivesModule, CoreSidebarModule, SweetAlert2Module],
  providers: [ReportsService],
})
export class ReportsModule { }
