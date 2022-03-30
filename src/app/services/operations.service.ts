import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  private baseUrl = "https://myozone.online/api";
  public result:any;
  constructor(private http:HttpClient) { }
  async banners(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"banners").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async info(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"contactInfo").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async condition(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"condition").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async categories(storeId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"categories/"+storeId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async orders(userId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"orders/"+userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async addOrder(userId:any,emailLogin:any,allpriceVal:any,fullNameLogin:any,numberLogin:any,address:any){
    return new Promise(resolve => {
      if(fullNameLogin == 0 || fullNameLogin == "" || fullNameLogin == undefined)
        fullNameLogin = 0;
      if(numberLogin == 0 || numberLogin == "" || numberLogin == undefined)
        numberLogin = 0;
      if(address == 0 || address == "" || address == undefined)
        address = 0;
      this.http.post(this.baseUrl+'/'+"addOrder"+"/"+userId+"/"+emailLogin+"/"+allpriceVal+"/"+fullNameLogin+"/"+numberLogin+"/"+address,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async addProductOrder(orderId:any,productId:any,name:any,productCat:any,description:any,quantity:any,price:any,image:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"addProductOrder"+"/"+orderId+"/"+productId+"/"+name+"/"+productCat+"/"+description+"/"+quantity+"/"+price+"/"+image,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async stores(limit:any=1){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"stores/"+limit).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async products(catId:any=0,name:any=0,disc:any=0,fromPrice:any=0,toPrice:any=0,limit:any=1,storeId:any=0){
    return new Promise(resolve => {
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      if(name == 0 || name == "" || name == undefined)
        name = 0;
      if(disc == 0 || disc == "" || disc == undefined)
        disc = 0;
      if(fromPrice == 0 || fromPrice == "" || fromPrice == undefined)
        fromPrice = 0;
      if(toPrice == 0 || toPrice == "" || toPrice == undefined)
        toPrice = 0;
      this.http.get(this.baseUrl+'/'+"products"+"/"+catId+"/"+name+"/"+disc+"/"+fromPrice+"/"+toPrice+"/"+limit+"/"+storeId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
