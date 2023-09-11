import { TestBed } from '@angular/core/testing';

import { FoodSupplierHomeService } from './food-supplier-home.service';

describe('FoodSupplierHomeService', () => {
  let service: FoodSupplierHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodSupplierHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
