import { Component, OnInit } from '@angular/core';
import { FoodSupplierHomeService } from './food-supplier-home.service';

@Component({
  selector: 'app-food-supplier-home',
  templateUrl: './food-supplier-home.component.html',
  styleUrls: ['./food-supplier-home.component.scss']
})
export class FoodSupplierHomeComponent implements OnInit {

  public foodSupplierData:any=[]
  
  constructor(private foodSupplierHomeService:FoodSupplierHomeService) { }

  ngOnInit(): void {
    this.getFoodSupplierData()
  }

  getFoodSupplierData():void{
    this.foodSupplierHomeService.getFoodSupplierData().subscribe((res)=>{
      this.foodSupplierData = res.response.data.notifications
      console.log(this.foodSupplierData)
    })
  }

}
