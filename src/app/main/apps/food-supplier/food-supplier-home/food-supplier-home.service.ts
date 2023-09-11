import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelperMockService } from 'app/core/services/http-helper-mock.service';

@Injectable({
  providedIn: 'root'
})
export class FoodSupplierHomeService {

  constructor(private _httpHelperMock: HttpHelperMockService) { }

  getFoodSupplierData(): Observable<any> {
    return this._httpHelperMock.request("getConfirmationNotification", {
      method: "GET",
    });
  }
}
