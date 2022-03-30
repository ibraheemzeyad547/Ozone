import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:any;
  errorEmail:any="";
  isErrorEmail:any = 1;
  password:any;
  errorPassword:any="";
  isErrorPassword:any = 1;
  isdisabled:boolean=true;

  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  showPassword: boolean = false;
  facebookToken:any;
  facebookUserId:any;
  result:any;
  firstTime:any;
  lastTime:any;
  operationResult:any;
  returnData:any;
  constructor(private http:HttpClient,private facebook: Facebook,private router : Router,private googlePlus:GooglePlus,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  checkEmail(event){
    this.errorEmail = "succsessFiled";
    this.isErrorEmail = 1;
    this.email = event;
    if(this.email == "" || this.email == undefined){
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
    }
    this.isEnterAllValues();
  }
  checkPassword(event){
    this.errorPassword = "succsessFiled";
    this.isErrorPassword = 1;
    this.password = event;
    if(this.password == "" || this.password == undefined){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
    }
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.email != undefined && this.email != "" && this.password != undefined && this.password != ""){
      this.isdisabled = true;
    }
  }
  ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
  }
  async googlePluseLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
    this.googlePlus.login({})
      .then(result => {
        let name = result.displayName;
        let email = result.email;
        let userGoogleId = result.userId;
        this.usersService.checkUserGoogle(name,email,userGoogleId).then(data=>{
          this.returnData = data;
          this.operationResult = this.returnData.Error.ErrorCode;
          if(this.operationResult==1){
            this.loadingShow = 0;
            this.storage.set('fullNameLogin',name);
            this.storage.set('emailLogin',email);
            this.storage.set('mobileLogin',"");
            this.storage.set('passwordLogin',"");
            this.storage.set('msgLogin',"");
            this.storage.set('userId',this.returnData.Error.insertId);
            this.navCtrl.navigateRoot("/home");
          }else if(this.operationResult==2){
            this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
            this.displayResult(this.message);
          }else if(this.operationResult==3){
            this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
            this.displayResult(this.message);
          }else{
            this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
            this.displayResult(this.message);
          }
        }).catch(e=>{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        })
      })
      .catch(err => {
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  async facebookLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        alert(JSON.stringify(res.status))
        if(res.status){
          this.facebookToken = res.authResponse.accessToken;
          this.facebookUserId = res.authResponse.userID;
          this.getFacebookData(this.facebookToken,this.facebookUserId)
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      })
      .catch(e => {
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
    this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
  getFacebookData(token:any,userId:any){
    let url = "https://graph.facebook.com/v2.9/me?fields=email,name&access_token="+token;
    this.http.get(url).subscribe(data => {
      this.result = data;
      this.usersService.functionFacebookLogIn(this.result.name,this.result.email,this.result.id).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.loadingShow = 0;
          this.storage.set('fullNameLogin',this.result.name);
          this.storage.set('emailLogin',this.result.email);
          this.storage.set('mobileLogin',"");
          this.storage.set('passwordLogin',"");
          this.storage.set('msgLogin',"");
          this.storage.set('userId',this.returnData.Error.insertId);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
          this.displayResult(this.message);
        }else if(this.operationResult==4){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
          this.displayResult(this.message);
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
    }, err => {
      this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
      this.displayResult(this.message);
    });
  }
  checkUser(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
      return false;
    });
    if((this.email == undefined || this.email == "") && (this.password == undefined || this.password == "")){
      this.errorEmail = "errorFiled";
      this.errorPassword = "errorFiled";
      this.isErrorEmail = 0;
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.email == undefined || this.email == ""){
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.password == undefined || this.password == ""){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    this.loadingShow = 1;
    if(this.email != undefined && this.password != undefined){
      this.usersService.checkUser(this.email,this.password).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.loadingShow = 0;
          this.storage.set('fullNameLogin',this.returnData.Data.name);
          this.storage.set('passwordLogin',this.password);
          this.storage.set('emailLogin',this.returnData.Data.email);
          this.storage.set('mobileLogin',this.returnData.Data.mobile);
          this.storage.set('msgLogin',this.returnData.Data.msg);
          this.storage.set('userId',this.returnData.Data.id);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية الدخول بنجاح...كلمة المرور غير صحيحة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...رقم الجوال غير صحيح";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
        this.loadingShow = 0;
      })
      this.isdisabled = true;
    }
  }
  async displayResult(message){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
  forgotPasssword(){
    this.navCtrl.navigateRoot("/forgotpasssword");
  }
  changeInputType(){
    this.showPassword = !this.showPassword;
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  async functionOpenMenue(){
    this.menu.enable(true,"first");
    this.menu.open("first");
  }
}
