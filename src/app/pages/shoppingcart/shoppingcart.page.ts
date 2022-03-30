import { Component, OnInit } from '@angular/core';
import {ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput,LoadingController,IonInfiniteScroll} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {OperationsService} from "../../services/operations.service";
import { Network } from '@ionic-native/network/ngx';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.page.html',
  styleUrls: ['./shoppingcart.page.scss'],
})
export class ShoppingcartPage implements OnInit {
  operationResult:any;
  message:any;
  returnProductsArray:any = [];
  products:any;
  allpriceVal:any;
  productInCart:any=[];
  userId:any;
  fullNameLogin:any;
  emailLogin:any;
  numberLogin:any;
  address:any;
  returnAddOrderData:any;
  returnAddProductOrderData:any;
  orderId:any;
  operationResultorderProduct:any;
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
    this.storage.get('addProductsToCart').then(addProductsToCart=>{
      this.returnProductsArray=[];
      if(addProductsToCart == null)
        addProductsToCart = new Array<any>();
      let allprice = 0;
      for(let i = 0; i < addProductsToCart.length;i++) {
        this.returnProductsArray[i]=[];
        this.returnProductsArray[i]['id'] = addProductsToCart[i][0];
        this.returnProductsArray[i]['name'] = addProductsToCart[i][1];
        this.returnProductsArray[i]['catName'] = addProductsToCart[i][2];
        this.returnProductsArray[i]['description'] = addProductsToCart[i][3];
        this.returnProductsArray[i]['image'] = addProductsToCart[i][4];
        this.returnProductsArray[i]['price'] = addProductsToCart[i][5];
        this.returnProductsArray[i]['view'] = 1;
        allprice = allprice + parseFloat(addProductsToCart[i][6]);
        this.returnProductsArray[i]['quntity'] = addProductsToCart[i][7];
      }
      this.allpriceVal = allprice.toFixed(2);
      this.allpriceVal = parseFloat(this.allpriceVal);
      let countOfData = this.returnProductsArray.length;
      if(countOfData == 0)
        this.products = 0;
      else{
        this.products = 1;
      }
    });
  }
  functionIncreaseQuntity(productId:any,index:any,price:any){
    let priceOldPro = 0;
    let quntityOldPro = 0;
    this.storage.get('addProductsToCart').then(addProductsToCart=>{
      let allprice = parseFloat(addProductsToCart[index][6]) + parseFloat(price);
      let allpricetow = parseFloat(this.allpriceVal) + parseFloat(price);
      this.allpriceVal = allpricetow.toFixed(2);
      this.allpriceVal = parseFloat(this.allpriceVal);
      let allpriceval = allprice.toFixed(2);
      addProductsToCart[index][6] = allpriceval;
      addProductsToCart[index][7] = addProductsToCart[index][7]+1;
      this.returnProductsArray[index]['quntity'] = addProductsToCart[index][7];
      this.storage.set('addProductsToCart',addProductsToCart);
      this.message = "تم زيادة كميةالطلب على المنتج";
      this.displayResult(this.message);
    });
  }
  functionDecreaseQuntity(productId:any,index:any,price:any){
    let priceOldPro = 0;
    let quntityOldPro = 0;
    this.storage.get('addProductsToCart').then(addProductsToCart=>{
      let allprice = parseFloat(addProductsToCart[index][6]) - parseFloat(price);
      let allpricetow = parseFloat(this.allpriceVal) - parseFloat(price);
      this.allpriceVal = allpricetow.toFixed(2);
      this.allpriceVal = parseFloat(this.allpriceVal);
      let allpriceval = allprice.toFixed(2);
      addProductsToCart[index][6] = allpriceval;
      addProductsToCart[index][7] = addProductsToCart[index][7]-1;
      this.returnProductsArray[index]['quntity'] = addProductsToCart[index][7];
      this.storage.set('addProductsToCart',addProductsToCart);
      this.message = "تم تقليل كمية الطلب على المنتج";
      this.displayResult(this.message);
    });
  }
  async functionRemoveFromCart(proId:any,index:any){
    this.storage.get('addProductsToCart').then(async addProductsToCart=>{
      if(addProductsToCart == null)
        addProductsToCart = new Array<any>();
      for(let i = 0;i < addProductsToCart.length;i++){
        if(addProductsToCart[i][0] == proId){
          let allprice = parseFloat(this.allpriceVal) - parseFloat(addProductsToCart[i][6]);
          this.allpriceVal = allprice.toFixed(2);
          this.allpriceVal = parseFloat(this.allpriceVal);
          addProductsToCart.splice(addProductsToCart.findIndex(elm => addProductsToCart[0][0] == proId),1);
          this.returnProductsArray[index]['view'] = 0;
        }
      }
      if(addProductsToCart.length == 0)
        await this.storage.set('addProductsToCart', this.productInCart);
      else
       await this.storage.set('addProductsToCart',addProductsToCart);
      await this.ngOnInit();
      this.message = "تم إزالة المنتج من سلة الشراء";
      this.displayResult(this.message);
    });
  }
  async functionAddOrder(){
    this.fullNameLogin = await this.storage.get('fullNameLogin');
    this.emailLogin = await this.storage.get('emailLogin');
    this.userId = await this.storage.get('userId');
    this.numberLogin = await this.storage.get('mobileLogin');
    this.address = await this.storage.get('msgLogin');
    if(this.emailLogin==null || this.userId==null){
      this.message = "لإتمام عملية الشراء يجب تسجيل الدخول";
      this.displayResult(this.message);
    }else{
      this.storage.get('addProductsToCart').then(async addProductsToCart=>{
        if(addProductsToCart.length!=0){
          this.operationsService.addOrder(this.userId,this.emailLogin,this.allpriceVal,this.fullNameLogin,this.numberLogin,this.address).then(async data=>{
            this.returnAddOrderData = data;
            this.operationResult = this.returnAddOrderData.Error.ErrorCode;
            if(this.operationResult==1){
              this.orderId = this.returnAddOrderData.Error.insertId;
              for(let i = 0; i < addProductsToCart.length;i++) {
                this.operationsService.addProductOrder(this.orderId,addProductsToCart[i][0],addProductsToCart[i][1],addProductsToCart[i][2],addProductsToCart[i][3],addProductsToCart[i][7],addProductsToCart[i][5],addProductsToCart[i][4]).then(async data=>{
                  this.returnAddProductOrderData = data;
                  this.operationResultorderProduct = this.returnAddProductOrderData.Error.ErrorCode;
                  if(this.operationResultorderProduct==1){
                  }
                });
              }

              await this.storage.set('addProductsToCart', this.productInCart);
             await this.ngOnInit();
              this.message = "تمت عملية إضافة طلبك بنجاح...يمكنك متابعة طلبكم من خلال شاشة طلباتي";
              this.displayResult(this.message);
            }else{
              this.message = "لم تتم عملية إضافة طلبك بنجاح...حاول مرة اخرى";
              this.displayResult(this.message);
            }
          });
        }
      });
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
