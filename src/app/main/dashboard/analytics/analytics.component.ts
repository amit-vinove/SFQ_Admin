import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import { first } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";

import { colors } from "app/colors.const";
import { User } from "app/auth/models";
import { UserService } from "app/auth/service";
import { DashboardService } from "app/main/dashboard/dashboard.service";
import Swal from "sweetalert2";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AnalyticsComponent implements OnInit {
  // Decorator
  @ViewChild("gainedChartRef") gainedChartRef: any;
  @ViewChild("orderChartRef") orderChartRef: any;
  @ViewChild("avgSessionChartRef") avgSessionChartRef: any;
  @ViewChild("supportChartRef") supportChartRef: any;
  @ViewChild("salesChartRef") salesChartRef: any;
  @ViewChild("chart",{ static: false }) chart: ChartComponent;
  public revenueChartOptions:any;
  public usersChartOptions:any;
  // Public
  public data: any;
  public currentUser: any;
  public loading = false;
  public users: User[] = [];
  public gainedChartoptions;
  public orderChartoptions;
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;
  public dashboardData: any;
  public revenueData:any=[]
  public userData:any=[]

  // Private
  private $primary = "#7367F0";
  private $warning = "#FF9F43";
  private $info = "#00cfe8";
  private $info_light = "#1edec5";
  private $strok_color = "#b9c3cd";
  private $label_color = "#e7eef7";
  private $white = "#fff";
  private $textHeadingColor = "#5e5873";

  /**
   * Constructor
   *
   * @param {UserService} _userService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   *
   */
  constructor(private _userService: UserService, private _dashboardService: DashboardService, private _coreConfigService: CoreConfigService) {
    // Subscribers Gained chart
    this.gainedChartoptions = {
      chart: {
        height: 100,
        type: "area",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: [this.$primary],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100],
        },
      },
      tooltip: {
        x: { show: false },
      },
    };

    // Order Received Chart
    this.orderChartoptions = {
      chart: {
        height: 100,
        type: "area",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100],
        },
      },
      series: [
        {
          name: "Orders",
          data: [10, 15, 8, 15, 7, 12, 8],
        },
      ],
      tooltip: {
        x: { show: false },
      },
    };

    // Average Session Chart
    this.avgsessionChartoptions = {
      chart: {
        type: "bar",
        height: 200,
        sparkline: { enabled: true },
        toolbar: { show: false },
      },
      colors: [this.$label_color, this.$label_color, this.$primary, this.$label_color, this.$label_color, this.$label_color],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          endingShape: "rounded",
        },
      },
      tooltip: {
        x: { show: false },
      },
    };

    // Support Tracker Chart
    this.supportChartoptions = {
      chart: {
        height: 290,
        type: "radialBar",
        sparkline: {
          enabled: false,
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: this.$white,
            strokeWidth: "100%",
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: this.$textHeadingColor,
              fontSize: "1rem",
            },
            value: {
              offsetY: 15,
              color: this.$textHeadingColor,
              fontSize: "1.714rem",
            },
          },
        },
      },
      colors: [colors.solid.danger],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Completed Tickets"],
    };

    // Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 330,
        type: "radar",
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 0,
      },
      colors: [this.$primary, this.$info],
      plotOptions: {
        radar: {
          polygons: {
            connectorColors: "transparent",
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#9f8ed7", this.$info_light],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
      },
      legend: {
        show: false,
      },
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      dataLabels: {
        style: {
          colors: [this.$strok_color, this.$strok_color, this.$strok_color, this.$strok_color, this.$strok_color, this.$strok_color],
        },
      },
      yaxis: {
        show: false,
      },
    };

  }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getDashboardData();
  }

  getDashboardData(): void {
    this._dashboardService.getDashboardData().subscribe(
      (res: any) => {
        if (res) {
          this.dashboardData = res.response.data;
          this.revenueData = res.response.data.revenue_results;
          this.userData = res.response.data.users
          this.initialzeRevenueChart(this.revenueData)
          this.initialzeUsersChart(this.userData)
        }
      },
      (err) => {
        Swal.fire("Oh snap!", "Well, this is unexpected... An error has occurred while processing your request. Please try again after sometime.", "error");
      }
    );
  }

  getRevenueMonths(data:any){
    const months=[]
    data?.forEach((element:any)=>{
      months.push(element.month)
    })
    return months
  }

  getRevenueAmounts(data:any){
    const revenue=[]
    data?.forEach((element:any)=>{
      revenue.push(parseInt(element.admin_revenue.split('$')[1]))
    })
    return revenue
  }

  getUsersMonths(data:any){
    const months=[]
    data?.forEach((element:any)=>{
      months.push(element.month)
    })
    return months
  }

  getUsersCount(data:any){
    const users=[]
    data?.forEach((element:any)=>{
      users.push(element.user_count)
    })
    return users
  }

  initialzeRevenueChart(data:any){
        //Revenue Chart Option
        this.revenueChartOptions = {
          series: [
            {
              name: "Revenue",
              data: this.getRevenueAmounts(data) ,
            }
          ],
          chart: {
            type: "area",
            height: 350,
            zoom: {
              enabled: false
            },
          },
          colors: ['#337c2a'],
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100],
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight"
          },
          title: {
            text: "Revenue Data",
            align: "left"
          },
          subtitle: {
            text: "Per Month Revenue",
            align: "left"
          },
          labels:this.getRevenueMonths(data),
          xaxis: {
            type: "category"
          },
          yaxis: {
            opposite: false
          },
          legend: {
            horizontalAlign: "left"
          }
        };
  }
  initialzeUsersChart(data:any){
    //Revenue Chart Option
    this.usersChartOptions = {
      series: [
        {
          name: "Users",
          data: this.getUsersCount(data)
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      colors: ['#337c2a'],
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100],
            },
          },
      title: {
        text: "User Growth by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.getUsersMonths(data)
      }
    };
}


}
