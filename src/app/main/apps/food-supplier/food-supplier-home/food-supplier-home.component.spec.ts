import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSupplierHomeComponent } from './food-supplier-home.component';

describe('FoodSupplierHomeComponent', () => {
  let component: FoodSupplierHomeComponent;
  let fixture: ComponentFixture<FoodSupplierHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodSupplierHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSupplierHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
