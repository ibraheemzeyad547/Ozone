import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = "https://myozone.online/api";
  public result:any;
  constructor(private http:HttpClient) { }
  async checkUserGoogle(name:any,email:any,googlUserId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkUserGoogle"+"/"+name+"/"+email+"/"+googlUserId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async checkUserAppel(name:any,email:any,appelUserId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkUserAppel"+"/"+name+"/"+email+"/"+appelUserId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async functionFacebookLogIn(name:any,email:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkUserFacebook"+"/"+name+"/"+email+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async aboutApp(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"about").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async registration(number:any,fullName:any,email:any,password:any,msg:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"registration"+"/"+number+"/"+fullName+"/"+email+"/"+password+"/"+msg,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateAccount(userId:any,fullName:any,number:any,address:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"updateAccount"+"/"+userId+"/"+fullName+"/"+number+"/"+address,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async forgotPassword(email:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"forgotPassword"+"/"+email,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async checkUser(email:any,password:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"checkUser"+"/"+email+"/"+password).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
