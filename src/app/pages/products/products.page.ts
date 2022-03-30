import { Component, OnInit } from '@angular/core';
import {ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput,LoadingController,IonInfiniteScroll} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {OperationsService} from "../../services/operations.service";
import { Network } from '@ionic-native/network/ngx';
import {SearchComponent} from "../search/search.component";
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
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
  storeId:any;
  storeLogo:any=0;
  constructor(private activaterouter : ActivatedRoute,private router : Router,private network:Network,private menu:MenuController,private modalController: ModalController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private operationsService:OperationsService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.message = "يرجى التحقق من الاتصال بالانترنت";
      this.displayResult(this.message);
    })
  }
  async functionSearch(){
    let model = await this.modalController.create({
      component:SearchComponent,
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.name = data.data.name;
      this.fromPrice = data.data.fromPrice;
      this.toPrice = data.data.toPrice;
      this.disc = data.data.disc;
      this.functionGetProfducts(this.catSelected,this.name,this.disc,this.fromPrice,this.toPrice,this.storeId);
    });
    await model.present();
  }
  functionAddToCart(productId:any,name:any,catName:any,description:any,image:any,price:any){
    let values = 0;
    let val = 0;
    let productIdOldPro = 0;
    let nameOldPro = 0;
    let catNameOldPro = 0;
    let descriptionOldPro = 0;
    let priceOldPro = 0;
    let quntityOldPro = 0;
    let imagePro = 0;
    this.storage.get('addProductsToCart').then(addProductsToCart=>{
      if(addProductsToCart == null)
        addProductsToCart = new Array<any>();
      for(let i = 0;i < addProductsToCart.length;i++){
        if(addProductsToCart[i][0] == productId){
          productIdOldPro = addProductsToCart[i][0];
          nameOldPro = addProductsToCart[i][1];
          catNameOldPro = addProductsToCart[i][2];
          descriptionOldPro = addProductsToCart[i][3];
          imagePro = addProductsToCart[i][4];
          priceOldPro = parseFloat(addProductsToCart[i][6])+parseFloat(price);
          quntityOldPro = addProductsToCart[i][7]+1;
          addProductsToCart.splice(addProductsToCart.findIndex(elm => addProductsToCart[val][0] == productId) ,1)
          values = 1;
          val = i;
          break;
        }else{
          values = 0;
        }
      }
      if(values == 1){
        let checkLastPrice = priceOldPro.toFixed(2);
        let checkPrice = parseFloat(checkLastPrice);
        this.productInCart = [productIdOldPro,nameOldPro,catNameOldPro,descriptionOldPro,imagePro,price,checkPrice,quntityOldPro];
        addProductsToCart.push(this.productInCart);
        this.storage.set('addProductsToCart',addProductsToCart);
      }else{
        this.productInCart = [productId,name,catName,description,image,price,price,1];
        addProductsToCart.push(this.productInCart);
        this.storage.set('addProductsToCart',addProductsToCart);
      }
      this.message = "تم إضافة المنتج على سلة الشراء";
      this.displayResult(this.message);
    });
  }
  functionGetProfducts(catId:any=0,name:any=0,disc:any=0,fromPrice:any=0,toPrice:any=0,storeId:any){
    let limitNew = this.loopingNumber;
    this.returnProductsArray=[];
    this.operationsService.products(catId,name,disc,fromPrice,toPrice,limitNew,storeId).then(data=>{
      this.returnProductsData = data;
      this.operationResult = this.returnProductsData.Error.ErrorCode;
      this.storeLogo = this.returnProductsData.Error.storeLogo;
      if(this.operationResult==1){
        this.countOfAllValues = this.returnProductsData.Data.countOfData;
        this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
        this.returnArrayProductsFromServer = this.returnProductsData.Data.products;
        for(let i = 0; i < this.returnArrayProductsFromServer.length;i++) {
          this.returnProductsArray[i]=[];
          this.returnProductsArray[i]['id'] = this.returnArrayProductsFromServer[i].id;
          this.returnProductsArray[i]['catName'] = this.returnArrayProductsFromServer[i].catName;
          this.returnProductsArray[i]['name'] = this.returnArrayProductsFromServer[i].name;
          this.returnProductsArray[i]['type']="منتج";
          if(this.returnArrayProductsFromServer[i].type == 2)
            this.returnProductsArray[i]['type']="عرض";
          this.returnProductsArray[i]['description'] = this.returnArrayProductsFromServer[i].description;
          this.returnProductsArray[i]['image'] = this.returnArrayProductsFromServer[i].image;
          if(this.returnProductsArray[i]['image'] == null || this.returnProductsArray[i]['image'] == undefined || this.returnProductsArray[i]['image']=="" || this.returnProductsArray[i]['image']==0)
            this.returnProductsArray[i]['image'] = "../../assets/imgs/logo.png";
          this.returnProductsArray[i]['price'] = this.returnArrayProductsFromServer[i].price;
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
      this.functionGetProfducts(this.catSelected,this.name,this.disc,this.fromPrice,this.toPrice,this.storeId);
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
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
    });
    if(this.search!=null && this.search!=undefined &&this.search!=0 )
      this.functionSearch();
    //let selectedVal= this.catSelected.toString();
    this.operationsService.categories(this.storeId).then(data=>{
      this.returnCategoriesData = data;
      this.operationResult = this.returnCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.categories;
        for(let i = 0; i < this.returnArrayCategoriesFromServer.length;i++) {
          this.returnCategoriesArray[i]=[];
          this.returnCategoriesArray[i]['id'] = this.returnArrayCategoriesFromServer[i].id;
          this.returnCategoriesArray[i]['title'] = this.returnArrayCategoriesFromServer[i].title;
          this.returnCategoriesArray[i]['class'] = "textSlider";
          this.returnCategoriesArray[i]['check'] = 1;
        }
        let countOfData = this.returnCategoriesArray.length;
        if(countOfData == 0)
          this.categories = 0;
        else{
          this.categories = 1;
        }
      }else
        this.categories = 0;
    });
    this.functionGetProfducts(0,0,0,0,0,this.storeId);
  }

  functionProductsByCat(id:any,check:any,index:any){
    for(let i = 0; i < this.returnCategoriesArray.length;i++) {
      this.returnCategoriesArray[i]['class'] = "textSlider";
      this.returnCategoriesArray[i]['check'] = 1;
      this.catSelected = 0;
    }
    if(check==1){
      this.returnCategoriesArray[index]['class'] = "textSliderCheck";
      this.returnCategoriesArray[index]['check'] = 2;
      this.catSelected = id;
    }
    this.functionGetProfducts(this.catSelected,this.name,this.disc,this.fromPrice,this.toPrice,this.storeId);
    //add val to function
  }
  functionProductsAllCat(){
    for(let i = 0; i < this.returnCategoriesArray.length;i++) {
      this.returnCategoriesArray[i]['class'] = "textSlider";
      this.returnCategoriesArray[i]['check'] = 1;
      this.catSelected=0;
    }
    this.name = 0;
    this.disc = 0;
    this.fromPrice = 0;
    this.toPrice = 0;
    this.functionGetProfducts(0,0,0,0,0,this.storeId);
    //add val to function
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
  functionHome(){
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
