import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { FoodSupplierComponent } from './food-supplier/food-supplier.component';
import { FoodSupplierService } from './food-supplier/food-supplier.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ConfirmationService } from './confirmation/confirmation.service';



// routing
const routes: Routes = [
  {
    path: 'food-supplier',
    component: FoodSupplierComponent,

    data: { animation: 'FoodSupplierComponent' }
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,

    data: { animation: 'ConfirmationComponent' }
  },


];
@NgModule({
  declarations: [
    FoodSupplierComponent,
    ConfirmationComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule
  ],
  providers: [FoodSupplierService, ConfirmationService]
})
export class FoodSupplierModule { }
