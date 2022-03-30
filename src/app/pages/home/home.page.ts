import { Component, OnInit } from '@angular/core';
import {ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput,LoadingController,IonInfiniteScroll} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {OperationsService} from "../../services/operations.service";
import { Network } from '@ionic-native/network/ngx';
import {SearchComponent} from "../search/search.component";
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slidesBanners',{static:false}) slidesBanners:IonSlides;
  @ViewChild('slidesBannersTow',{static:false}) slidesBannersTow:IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  operationResult:any;
  message:any;
  banners:any
  returnBannersHomeArray:any = [];
  returnArrayBannersHomeFromServer:any;
  returnBannersHomeData:any;
  categories:any=0;
  returnCategoriesData:any;
  returnArrayCategoriesFromServer:any;
  returnCategoriesArray:any = [];
  catSelected:any=0;
  products:any;
  name:any;
  fromPrice:any;
  toPrice:any;
  disc:any;
  returnProductsData:any;
  returnArrayProductsFromServer:any;
  returnProductsArray:any = [];
  loopingNumber:any = 1;
  countOfAllValuesDivOnTen:any;
  countOfAllValues:any=0;
  productInCart:any=[];
  search:any=0;
  userId:any;
  emailLogin:any;
  constructor(private activaterouter : ActivatedRoute,private router : Router,private network:Network,private menu:MenuController,private modalController: ModalController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private operationsService:OperationsService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  functionGetProfducts(){
    let limitNew = this.loopingNumber;
    this.returnProductsArray=[];
    this.operationsService.stores(limitNew).then(data=>{
      this.returnProductsData = data;
      this.operationResult = this.returnProductsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.countOfAllValues = this.returnProductsData.Data.countOfData;
        this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
        this.returnArrayProductsFromServer = this.returnProductsData.Data.stores;
        for(let i = 0; i < this.returnArrayProductsFromServer.length;i++) {
          this.returnProductsArray[i]=[];
          this.returnProductsArray[i]['id'] = this.returnArrayProductsFromServer[i].id;
          this.returnProductsArray[i]['name'] = this.returnArrayProductsFromServer[i].title;
          this.returnProductsArray[i]['description'] = this.returnArrayProductsFromServer[i].description;
          this.returnProductsArray[i]['image'] = this.returnArrayProductsFromServer[i].image;
          this.returnProductsArray[i]['logo'] = this.returnArrayProductsFromServer[i].logo;
          if(this.returnProductsArray[i]['image'] == null || this.returnProductsArray[i]['image'] == undefined || this.returnProductsArray[i]['image']=="" || this.returnProductsArray[i]['image']==0)
            this.returnProductsArray[i]['image'] = "../../assets/imgs/logo.png";
          if(this.returnProductsArray[i]['logo'] == null || this.returnProductsArray[i]['logo'] == undefined || this.returnProductsArray[i]['logo']=="" || this.returnProductsArray[i]['logo']==0)
            this.returnProductsArray[i]['logo'] = "../../assets/imgs/logo.png";
        }
        let countOfData = this.returnProductsArray.length;
        if(countOfData == 0)
          this.products = 0;
        else{
          this.products = 1;
        }
      }else
        this.products = 0;
    });
  }
  loadMoreData(event) {
    this.loopingNumber++;
    setTimeout(() => {
      this.functionGetProfducts();
      event.target.complete();
      if (this.loopingNumber >= this.countOfAllValuesDivOnTen) {
        event.target.disabled = true;
      }
    }, 2000);
  }
  async ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
    //let selectedVal= this.catSelected.toString();
    this.operationsService.banners().then(data=>{
      this.returnBannersHomeData = data;
      this.operationResult = this.returnBannersHomeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayBannersHomeFromServer = this.returnBannersHomeData.Data.banners;
        for(let i = 0; i < this.returnArrayBannersHomeFromServer.length;i++) {
          this.returnBannersHomeArray[i]=[];
          this.returnBannersHomeArray[i]['id'] = this.returnArrayBannersHomeFromServer[i].id;
          this.returnBannersHomeArray[i]['image'] = this.returnArrayBannersHomeFromServer[i].image;
        }
        let countOfData = this.returnBannersHomeArray.length;
        if(countOfData == 0)
          this.banners = 0;
        else{
          this.banners = 1;
        }
      }else
        this.banners = 0;
    });
    this.functionGetProfducts();
  }
  slidesBannersLoad(){
    this.slidesBanners.startAutoplay();
  }
  slidesBannersTowLoad(){
    this.slidesBannersTow.startAutoplay();
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
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  functionStoreInfo(storeId:any){
    this.router.navigate(['/products', {storeId:storeId}])
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
