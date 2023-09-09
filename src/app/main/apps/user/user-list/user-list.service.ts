import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class UserListService {
  public rows: any;

  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) { }

  getUserList(pageNumber, pageSize): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "GetUserDetails?pageNumber=" + pageNumber + "&pageSize=" + pageSize).subscribe(
        {
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  deleteUser(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "DeleteUser/" + id, id).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  statusUpdate(id: number, methodName: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + methodName + "/" + id, id).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }


  exportFile(type: any, pageNumber: any, pageSize: any) {
    return this._httpClient
      .get(this.apiUrl + "api/users/export?pageNumber=" + pageNumber + "&pageSize="
        + pageSize + "&format=" + type, { observe: 'response', responseType: 'blob' });
  }

}
