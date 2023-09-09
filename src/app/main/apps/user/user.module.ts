import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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

import { UserListComponent } from "app/main/apps/user/user-list/user-list.component";
import { UserListService } from "app/main/apps/user/user-list/user-list.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

// routing
const routes: Routes = [
  {
    path: "user-list",
    component: UserListComponent,

    data: { animation: "UserListComponent" },
  },
];

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CoreCommonModule, FormsModule, NgbModule, NgSelectModule, Ng2FlatpickrModule, NgxDatatableModule, CorePipesModule, CoreDirectivesModule, CoreSidebarModule,SweetAlert2Module],
  providers: [UserListService],
})
export class UserModule { }
