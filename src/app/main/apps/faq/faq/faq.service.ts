import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  public rows: any;

  public faqList = new BehaviorSubject<any[]>([]);
  public castFaqList = this.faqList.asObservable();

  public faqId = new BehaviorSubject<any>('');
  public castFaqId = this.faqId.asObservable();

  public editFAQMode = new BehaviorSubject<any>(false);
  public castEditFAQMode = this.editFAQMode.asObservable();

  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {

  }


  getFAQList(pageNumber: any, pageSize: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "api/FAQ/GetFAQ?pageNumber=" + pageNumber + "&pageSize=" + pageSize).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getFaqPages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + "api/Dropdown/GetFaqPages").subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
  }


  saveFaQ(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/FAQ/SaveFAQ", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  deleteFAQ(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/FAQ/DeleteFAQ/" + id, id).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  editFaQ(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.apiUrl + "api/FAQ/UpdateFAQ", data).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getFAQbyId(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.apiUrl + `api/FAQ/GetFAQById?Id=${id}`).subscribe({
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
