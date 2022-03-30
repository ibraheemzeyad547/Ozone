import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;

  fullName:any;
  errorFullName:any="";
  isErrorFullName:any = 1;

  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  result:any;
  msg:any;
  errorMsg:any="";
  isErrorMsg:any = 1;
  userId:any;
  emailLogin:any;
  constructor(private googlePlus:GooglePlus,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  async ngOnInit() {
    this.fullName = await this.storage.get('fullNameLogin');
    this.number = await this.storage.get('mobileLogin');
    this.msg = await this.storage.get('msgLogin');
    this.userId = await this.storage.get('userId');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
  }
  checkMsg(event){
    this.errorMsg = "succsessFiled";
    this.isErrorMsg = 1;
    this.msg = event;
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.fullName != undefined && this.fullName != "" && this.number != undefined && this.number != "" && this.number != ""){
      this.isdisabled = true;
    }
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
  async updateAccount(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
    if((this.fullName == undefined || this.fullName == "") && (this.msg == undefined || this.msg == "") && (this.number == undefined || this.number == "")){
      this.errorFullName = "errorFiled";
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
      this.isErrorFullName = 0;
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
    if(this.msg == undefined || this.msg == ""){
      this.errorMsg = "errorFiled";
      this.isErrorMsg = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.fullName != undefined && this.number != undefined && this.msg != undefined){
      this.usersService.updateAccount(this.userId,this.fullName,this.number,this.msg).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.storage.set('fullNameLogin',this.fullName);
          this.storage.set('mobileLogin',this.number);
          this.storage.set('msgLogin',this.msg);
          this.message = "تمت عملية تعديل المعلومات بنجاح";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية تعديل المعلومات بنجاح...البيانات فارغة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية تعديل المعلومات بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
      }).catch(e=>{
        this.message = "لم تتم عملية تعديل المعلومات بنجاح...حاول مرة اخرى";
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
