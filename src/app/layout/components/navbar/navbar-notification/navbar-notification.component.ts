import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import Swal from 'sweetalert2';

// Interface
interface notification {
  messages: [];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: any;
  public unreadNotifications:any;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(private _notificationsService: NotificationsService) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this._notificationsService.onApiDataChange.subscribe(res => {
    //   this.notifications = res;
    // });

    this._notificationsService.getNotificationData().subscribe((res:any)=>{
      if(res){
        this.notifications = res?.response?.data?.notifications
        this.unreadNotifications = this.countNotifications(this.notifications)
      }
    },(err)=>{
      Swal.fire("Oh snap!", "Well, this is unexpected... An error has occurred while processing your request. Please try again after sometime.", "error");
    })
  }

  countNotifications(data:any){
    var count = 0
    data.forEach((element:any)=>{
      if(!element.read_status){
        count++
      }
    })
    return count
  }

  readAllnotifications(){
    this.unreadNotifications = 0
  }

}
