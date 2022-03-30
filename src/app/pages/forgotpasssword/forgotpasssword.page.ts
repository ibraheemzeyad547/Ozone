import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-forgotpasssword',
  templateUrl: './forgotpasssword.page.html',
  styleUrls: ['./forgotpasssword.page.scss'],
})
export class ForgotpassswordPage implements OnInit {
  email:any;
  errorEmail:any="";
  isErrorEmail:any = 1;
  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  userId:any;
  emailLogin:any;
  constructor(private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
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
  isEnterAllValues(){
    if(this.email != undefined && this.email != ""){
      this.isdisabled = true;
    }
  }
  ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    });
  }
  async forgotPassword(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','forgotpasssword');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if((this.email == undefined || this.email == "")){
      this.errorEmail = "errorFiled";
      this.isErrorEmail  = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.email == undefined || this.email == ""){
      this.errorEmail = "errorFiled";
      this.isErrorEmail  = 0;
      this.isdisabled = false;
      return false;
    }
    this.loadingShow = 1;
    if(this.email != undefined ){
      this.usersService.forgotPassword(this.email).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "تم إرسال رسالة بكلمة المرور على البريد الالكتروني";
          this.displayResult(this.message);
          this.loadingShow = 0;
          this.navCtrl.navigateRoot("/login");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية إرسال كلمة المرور بنجاح...البيانات فارغة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية إرسال كلمة المرور بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }else{
          this.message = "لم تتم عملية إرسال كلمة المرور بنجاح...خطأ في المعلومات المدخلة";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
      }).catch(e=>{
        this.message = "لم تتم عملية إرسال كلمة المرور بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
        this.loadingShow = 0;
      })
      this.isdisabled = true;
    }
  }
  async displayResult(message){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
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
