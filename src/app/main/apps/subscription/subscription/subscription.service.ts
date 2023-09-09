import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  public rows: any;

  public subscriptionList = new BehaviorSubject<any[]>([]);
  public castSubscriptionList = this.subscriptionList.asObservable();

  public subscriptionId = new BehaviorSubject<any>('');
  public castSubscriptionId = this.subscriptionId.asObservable();

  public editSubscriptionMode = new BehaviorSubject<any>(false);
  public castEditSubscriptionMode = this.editSubscriptionMode.asObservable();

  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {

  }


  getSubscriptionsList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "api/SubscriptionManagement/GetSupplierSubscriptionInfo").subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  saveSubscription(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/SubscriptionManagement/SaveSubscriptionInfo", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  deleteSubscription(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/SubscriptionManagement/DeleteSubscriptionInfo/" + id, id).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  editSubscription(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/SubscriptionManagement/UpdateSubscriptionInfo", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getSubscriptionbyId(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + `api/SubscriptionManagement/GetSubscriptionInfoById?Id=${id}`).subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
  }
}
