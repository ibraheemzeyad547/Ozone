import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {HttpClient} from "@angular/common/http";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;

  fullName:any;
  errorFullName:any="";
  isErrorFullName:any = 1;

  password:any;
  errorPassword:any="";
  isErrorPassword:any = 1;

  rePassword:any;
  errorRePassword:any="";
  errorRePasswordMsg:any="";
  isErrorRePassword:any = 1;

  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  showPassword: boolean = false;
  showLoginWithApple:any = 0;
  facebookToken:any;
  facebookUserId:any;
  result:any;

  email:any;
  errorEmail:any;
  isErrorEmail:any=1;
  checkEmailVal:any=0
  checkEmailEnter:any = "";

  msg:any;
  errorMsg:any="";
  isErrorMsg:any = 1;
  userId:any;
  emailLogin:any;
  constructor(private http:HttpClient,private googlePlus:GooglePlus,private facebook: Facebook,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  changeInputType(){
    this.showPassword = !this.showPassword;
  }
  checkMsg(event){
    this.errorMsg = "succsessFiled";
    this.isErrorMsg = 1;
    this.msg = event;
    this.isEnterAllValues();
  }
  checkNumber(event){
    this.errorNumber = "succsessFiled";
    this.isErrorNumber = 1;
    this.number = event;
    if(this.number == "" || this.number == undefined){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
    }
    this.isEnterAllValues();
  }
  checkFullName(event){
    this.errorFullName = "succsessFiled";
    this.isErrorFullName = 1;
    this.fullName = event;
    if(this.fullName == "" || this.fullName == undefined){
      this.errorFullName = "errorFiled";
      this.isErrorFullName = 0;
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
  checkRePassword(event){
    this.errorRePassword = "succsessFiled";
    this.isErrorRePassword = 1;
    this.rePassword = event;
    if(this.rePassword == "" || this.rePassword == undefined){
      this.errorRePassword = "errorFiled";
      this.isErrorRePassword = 0;
    }
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.fullName != undefined && this.fullName != "" && this.email != undefined && this.email != "" && this.number != undefined && this.number != "" && this.password != undefined && this.password != "" && this.rePassword != undefined && this.rePassword != "" && this.password == this.rePassword){
      this.isdisabled = true;
    }
  }
  async facebookLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
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
  async googlePluseLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
      return false;
    });

    this.googlePlus.login({})
      .then(result => {
        let name =result.displayName;
        let email =result.email;
        let userGoogleId =result.userId;
        this.usersService.checkUserGoogle(name,email,userGoogleId).then(data=>{
          this.returnData = data;
          this.operationResult = this.returnData.Error.ErrorCode;
          if(this.operationResult==1){
            this.loadingShow = 0;
            this.storage.set('fullNameLogin',name);
            this.storage.set('emailLogin',email);
            this.storage.set('passwordLogin',"");
            this.storage.set('mobileLogin',"");
            this.storage.set('msgLogin',"");
            this.storage.set('userId',this.returnData.Error.insertId);
            this.navCtrl.navigateRoot("/home");
          }else if(this.operationResult==2){
            this.message = "لم تتم عملية التسجيل بنجاح...البيانات فارغة";
            this.displayResult(this.message);
          }else if(this.operationResult==3){
            this.message = "لم تتم عملية التسجيل بنجاح...البيانات غير صحيحة";
            this.displayResult(this.message);
          }else{
            this.message = "لم تتم عملية التسجيل بنجاح...حاول مرة اخرى";
            this.displayResult(this.message);
          }
        }).catch(e=>{
          this.message = "لم تتم عملية التسجيل بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        })
      })
      .catch(err => {
        this.message = "لم تتم عملية التسجيل بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
  }
  checkEmail(event){
    this.errorEmail = "succsessFiled";
    this.isErrorEmail = 1;
    this.email = event;
    if(this.email == "" || this.email == undefined){
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
      this.checkEmailVal = 0;
      this.checkEmailEnter = "إدخل البريد الالكتروني";
    }else{
      this.checkEmailEnter = "";
      let checkVal = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!checkVal.test(this.email)){
        this.errorEmail = "errorFiled";
        this.isErrorEmail = 0;
        this.checkEmailVal = 0;
        this.checkEmailEnter = "إدخل البريد الالكتروني بالشكل الصحيح";
      }
      else{
        this.errorEmail = "succsessFiled";
        this.isErrorEmail = 1;
        this.checkEmailVal = 1;
        this.checkEmailEnter = "";
      }
    }
  }
  async registration(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
    if((this.fullName == undefined || this.fullName == "") && (this.msg == undefined || this.msg == "") && (this.number == undefined || this.number == "") && (this.password == undefined || this.password == "") && (this.rePassword == undefined || this.rePassword == "") && this.checkEmailVal == 0 ){
      this.errorFullName = "errorFiled";
      this.errorNumber = "errorFiled";
      this.errorPassword = "errorFiled";
      this.errorRePassword = "errorFiled";
      this.isErrorNumber = 0;
      this.isErrorFullName = 0;
      this.isErrorPassword = 0;
      this.isErrorRePassword = 0;
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
      this.checkEmailEnter = "إدخل البريد الالكتروني";
      this.errorRePasswordMsg = "الرجاء إدخال تأكيد كلمة المرور";
      this.isdisabled = false;
      this.errorMsg = "errorFiled";
      this.isErrorMsg = 0;
      return false;
    }
    if(this.number == undefined || this.number == ""){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.fullName == undefined || this.fullName == ""){
      this.errorFullName = "errorFiled";
      this.isErrorFullName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.email == undefined){
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
      this.checkEmailEnter = "إدخل البريد الالكتروني";
      return false;
    }
    if(this.checkEmailVal == 0){
      this.errorEmail = "errorFiled";
      this.isErrorEmail = 0;
      this.checkEmailEnter = "إدخل البريد الالكتروني بالشكل الصحيح";
      return false;
    }
    if(this.password == undefined || this.password == ""){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.rePassword == undefined || this.rePassword == ""){
      this.errorRePassword = "errorFiled";
      this.isErrorRePassword = 0;
      this.errorRePasswordMsg = "الرجاء إدخال تأكيد كلمة المرور";
      this.isdisabled = false;
      return false;
    }
    if(this.password != this.rePassword){
      this.errorRePassword = "errorFiled";
      this.isErrorRePassword = 0;
      this.errorRePasswordMsg = "كلمة المرور و تأكيد كلمة المرور غير متطابقتان";
      this.isdisabled = false;
      return false;
    }
    if(this.msg == undefined || this.msg == ""){
      this.errorMsg = "errorFiled";
      this.isErrorMsg = 0;
      this.isdisabled = false;
      return false;
    }
    this.loadingShow = 1;
    if(this.fullName != undefined && this.number != undefined && this.password != undefined && this.rePassword != undefined && this.email != undefined && this.msg != undefined){
      this.usersService.registration(this.number,this.fullName,this.email,this.password,this.msg).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "تم إنشاء حسابك بنجاح ... سيتم الانتقال الى صفحة الدخول";
          this.displayResult(this.message);
          this.navCtrl.navigateRoot("/login");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية إنشاء الحساب بنجاح...البيانات فارغة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية إنشاء الحساب بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==4){
          this.message = "لم تتم عملية إنشاء الحساب بنجاح...رقم الجوال مكرر";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
      }).catch(e=>{
        this.message = "لم تتم عملية إنشاء الحساب بنجاح...حاول مرة اخرى";
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
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  async functionOpenMenue(){
    this.emailLogin = await this.storage.get('emailLogin');
    this.userId = await this.storage.get('userId');
    if(this.emailLogin!=null && this.emailLogin!=null){
      this.menu.enable(true,"last");
      this.menu.open("last");
    }
    else{
      this.menu.enable(true,"first");
      this.menu.open("first");
    }
  }
}
