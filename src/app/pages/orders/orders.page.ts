import { Component, OnInit } from '@angular/core';
import {ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput,LoadingController,IonInfiniteScroll} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {OperationsService} from "../../services/operations.service";
import { Network } from '@ionic-native/network/ngx';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  operationResult:any;
  message:any;
  returnOrdersData:any;
  returnArrayOrdersFromServer:any;
  returnArraySubProductCartFromServer:any;
  returnOrdersArray:any = [];
  orders:any;
  userId:any;
  fullNameLogin:any;
  emailLogin:any;
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
    this.emailLogin = await this.storage.get('emailLogin');
    this.userId = await this.storage.get('userId');
    if(this.emailLogin==null || this.userId==null)
      this.navCtrl.navigateRoot("/home");
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
    this.operationsService.orders(this.userId).then(data=>{
      this.returnOrdersArray=[];
      this.returnOrdersData = data;
      this.operationResult = this.returnOrdersData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayOrdersFromServer = this.returnOrdersData.Data.orders;
        for(let i = 0; i < this.returnArrayOrdersFromServer.length;i++) {
          this.returnOrdersArray[i]=[];
          this.returnOrdersArray[i]['allPrice'] = this.returnArrayOrdersFromServer[i].allPrice;
          this.returnOrdersArray[i]['orderNumber'] = this.returnArrayOrdersFromServer[i].orderNumber;
          this.returnOrdersArray[i]['date'] = this.returnArrayOrdersFromServer[i].date;
          if(this.returnArrayOrdersFromServer[i].orderType == 1)
            this.returnOrdersArray[i]['orderType'] = "قيد المعالجة";
          if(this.returnArrayOrdersFromServer[i].orderType == 2)
            this.returnOrdersArray[i]['orderType'] = "قيد التوصيل";
          if(this.returnArrayOrdersFromServer[i].orderType == 3)
            this.returnOrdersArray[i]['orderType'] = "تم توصيلة";
          if(this.returnArrayOrdersFromServer[i].orderType == 4)
            this.returnOrdersArray[i]['orderType'] = "ملغي";
          if(this.returnArrayOrdersFromServer[i].orderType == 5)
            this.returnOrdersArray[i]['orderType'] = "منتهي";
          this.returnOrdersArray[i]['check'] = 0;
          this.returnArraySubProductCartFromServer = this.returnArrayOrdersFromServer[i].orderProduct;
          this.returnOrdersArray[i]['orderProduct'] = [];
          for(let j = 0; j < this.returnArraySubProductCartFromServer.length;j++){
            this.returnOrdersArray[i]['orderProduct'][j] = [];
            this.returnOrdersArray[i]['orderProduct'][j]['productName'] = this.returnArraySubProductCartFromServer[j].productName;
            this.returnOrdersArray[i]['orderProduct'][j]['productCat'] = this.returnArraySubProductCartFromServer[j].productCat;
            this.returnOrdersArray[i]['orderProduct'][j]['quantity'] = this.returnArraySubProductCartFromServer[j].quantity;
            this.returnOrdersArray[i]['orderProduct'][j]['price'] = this.returnArraySubProductCartFromServer[j].price;
            this.returnOrdersArray[i]['orderProduct'][j]['productImage'] = this.returnArraySubProductCartFromServer[j].productImage;
            if(this.returnArraySubProductCartFromServer[j].productImage == null || this.returnArraySubProductCartFromServer[j].productImage == undefined || this.returnArraySubProductCartFromServer[j].productImage=="" || this.returnArraySubProductCartFromServer[j].productImage==0)
              this.returnOrdersArray[i]['orderProduct'][j]['productImage']= "../../assets/imgs/logo.png";
          }
        }
        let countOfData = this.returnOrdersArray.length;
        if(countOfData == 0)
          this.orders = 0;
        else{
          this.orders = 1;
        }
      }else
        this.orders = 0;
    });
  }
  changeViewProduct(val,i){
    if(val == 1)
      this.returnOrdersArray[i]['check'] = 0;
    if(val == 0)
      this.returnOrdersArray[i]['check'] = 1;
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
