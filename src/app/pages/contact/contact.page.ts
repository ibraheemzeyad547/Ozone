import { Component, OnInit } from '@angular/core';
import {ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput,LoadingController,IonInfiniteScroll} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {OperationsService} from "../../services/operations.service";
import { Network } from '@ionic-native/network/ngx';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  operationResult:any;
  message:any;
  description:any;
  isThere:any = 1;
  returnData:any;
  loadingShow:any = 0;
  userId:any;
  emailLogin:any;
  info:any
  returninfoArray:any = [];
  returnArrayinfoFromServer:any;
  returninfoData:any;
  constructor(private activaterouter : ActivatedRoute,private router : Router,private network:Network,private menu:MenuController,private modalController: ModalController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private operationsService:OperationsService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  async functionSearch(){
    this.router.navigate(['/home', {search:1}])
  }
  async ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
    this.loadingShow = 1;
    this.operationsService.info().then(data=>{
      this.returninfoData = data;
      this.operationResult = this.returninfoData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayinfoFromServer = this.returninfoData.Data.contactInfo;
        for(let i = 0; i < this.returnArrayinfoFromServer.length;i++) {
          this.returninfoArray[i]=[];
          this.returninfoArray[i]['name'] = this.returnArrayinfoFromServer[i].name;
          this.returninfoArray[i]['value'] = this.returnArrayinfoFromServer[i].value;
        }
        let countOfData = this.returninfoArray.length;
        if(countOfData == 0)
          this.info = 0;
        else{
          this.info = 1;
        }
      }else
        this.info = 0;
      this.loadingShow = 0;
    });
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
