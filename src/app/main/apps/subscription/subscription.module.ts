import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription/subscription.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CoreSidebarModule } from '@core/components';
import { SubscriptionService } from './subscription/subscription.service';
import { NewSubscriptionComponent } from './subscription/new-subscription/new-subscription.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
// routing
const routes: Routes = [
  {
    path: 'subscription',
    component: SubscriptionComponent,

    data: { animation: 'SubscriptionComponent' }
  },
  {
    path: 'add-subscription',
    component: NewSubscriptionComponent,

    data: { animation: 'NewSubscriptionComponent' }
  }


];

@NgModule({
  declarations: [
    SubscriptionComponent,
    NewSubscriptionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule, AngularEditorModule
  ],
  providers: [SubscriptionService],
})
export class SubscriptionModule { }
