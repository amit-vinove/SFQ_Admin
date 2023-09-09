import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  private baseUrl: string = environment.apiUrl;
  private httpOptions: {
    headers: HttpHeaders;
    observe: string;
    responseType: string;
    reportProgress: boolean;
    body: {};
    withCredentials: boolean;
    quiet: string;
    search: string;
    params: {};
  } | undefined;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  static getRequestMethod(options: any): string {
    return options && options.method
      ? options.method
      : options.body === undefined
        ? 'GET'
        : 'POST';
  }

  static createDefaultOptions(options: any): any {
    return {
      headers: options.headers ? options.headers : new HttpHeaders(),
      observe: 'body',
      responseType: options.responseType ? options.responseType : 'json',
      reportProgress: options.reportProgress ? options.reportProgress : false,
      body: options.body ? options.body : undefined,
      withCredentials: options.withCredentials
        ? options.withCredentials
        : false,
      quiet: options.quiet ? options.quiet : undefined,
      params: options.params ? options.params : undefined
    };
  }

  public request<T = any>(endpoint: string, options: any = {}): Observable<T> {

    const finalOptions = HttpHelperService.createDefaultOptions(options);
    const requestMethod = HttpHelperService.getRequestMethod(options);
    const fullUrl = this.getFullUrl(endpoint);
    return this.httpClient
      .request(requestMethod, fullUrl, finalOptions)
      .pipe(catchError(this.handleError));
  }

  public getFullUrl(request: string): string {
    let url = this.baseUrl + "/api" + request;
    // url = (url.endsWith('/')) ? url : url + '/';
    return url;
  }

  private routeToNoAuth(): void {
    const children = this.router.config[0].children;
    if (children) {
      for (let childRoute of children) {
        if (childRoute.path === 'not-authorized') {
          this.router.navigateByUrl('/not-authorized');
        }
      }
    }
  }

  private routeToLogin(): void {
    Swal.fire({
      title: "Session expired",
      icon: 'warning',
    }).then((result) => {
      this.router.navigateByUrl('/auth/login');
    })

  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
      // this.alerts.danger(error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status) {
        switch (error.status) {
          case 401:
            // JWT Token expired

            break;
          case 403:
            //   'You were not authorized to complete the action'
            this.routeToNoAuth();
            break;
          case 404:

            break;
          case 500:
            if (error.error.message) {

            } else if (error.error instanceof Blob) {
              let reader = new FileReader();
              reader.addEventListener("loadend", () => {
                if (reader?.result) {
                  let message = JSON.parse(reader.result.toString()).message;
                } else {
                  let message = "loaded"
                }

              });
              reader.readAsText(error.error);
            } else if (error.message) {

            }
            break;
          default:
        }
      } else {

      }
    }
    // return an observable with a user-facing error message
    throw error;
    return new Observable<any>();

  };
}
