import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class FoodSupplierService {
  public rows: any;

  readonly apiUrl: string = environment.apiUrl;
  pageNumber: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) { }

  getSupplierList(pageNumber, pageSize): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "api/SupplierProfile/GetSupplierProfile?pageNumber=" + pageNumber + "&pageSize=" + pageSize).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  deleteSupplier(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/SupplierProfile/DeleteFoodSupplier/" + id, id).subscribe({
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
      this._httpClient.post(this.apiUrl + "api/SupplierProfile/" + methodName + "/" + id, id).subscribe({
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
      .get(this.apiUrl + "api/SupplierProfile/api/Suppliers/export?pageNumber=" + pageNumber + "&pageSize="
        + pageSize + "&format=" + type, { observe: 'response', responseType: 'blob' });
  }
}
