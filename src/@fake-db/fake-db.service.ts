import { InMemoryDbService } from 'angular-in-memory-web-api';


import { CardAnalyticsData } from '@fake-db/card-analytics.data';
import { CardStatisticsData } from '@fake-db/card-statistics.data';
import { ChatWidgetFakeData } from '@fake-db/chat-widget.data';
;
import { DashboardFakeData } from '@fake-db/dashboard.data';
import { DatatableFakeData } from '@fake-db/datatables';

import { PricingFakeData } from '@fake-db/pricing.data';
import { ProfileFakeData } from '@fake-db/profile.data';
import { SearchFakeData } from '@fake-db/search.data';

import { UsersFakeData } from '@fake-db/users.data';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Data-table
      'datatable-rows': DatatableFakeData.rows,




      // Pricing
      'pricing-data': PricingFakeData.data,



      // Profile
      'profile-data': ProfileFakeData.data,

      // Card Statistics
      'card-statistics-data': CardStatisticsData.data,

      // Card Analytics
      'card-analytics-data': CardAnalyticsData.data,

      // Users
      'users-data': UsersFakeData.users,







      // Chat Widget
      'chat-widget-data': ChatWidgetFakeData.data,


      // Search
      'search-data': SearchFakeData.search,


      // Dashboard
      'dashboard-data': DashboardFakeData.data
    };
  }
}
