import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AccountSettingsService {
  rows: any;
  onSettingsChanged: BehaviorSubject<any>;

  public readonly user: any;
  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _authenticationService: AuthenticationService) {
    // Set the defaults
    this.onSettingsChanged = new BehaviorSubject({});
    this.user = JSON.parse(localStorage.getItem('currentUser') as string);
  }



  getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "api/Account/GetUserAccountInfo?UserId=" + this.user.id).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }




  updateUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/Account/UpdateUser", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  changePassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/ChangePassword/ChangePassword", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

}
