import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, Platform} from '@ionic/angular';
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showFirstPage:any;
  fullNameLogin:any;
  emailLogin:any;
  public appPagesfirst = [
    { title: 'تسجيل الدخول', url: '/login'},
    { title: 'إنشاء حساب', url: '/registration'},
    { title: 'الشروط و القوانين', url: '/condition'},
    { title: 'للتواصل', url: '/contact'},
  ];
  public appPagesLast = [
    { title: 'حسابي', url: '/account' },
    { title: 'طلباتي', url: '/orders' },
    { title: 'الشروط و القوانين', url: '/condition'},
    { title: 'للتواصل', url: '/contact'},
    { title: 'تسجيل الخروج', url: ''},
  ];
  appPages:any;
  constructor(private alertController:AlertController,private router : Router,private platform : Platform,private storage: Storage) {
    this.platform.ready().then(() => {
    });
  }
  async signOut(){
    const alert = await this.alertController.create({
      cssClass: 'alertBac',
      mode: 'ios',
      message: '! هل انت متأكد',
      buttons: [
        {
          text: 'لا',
          cssClass: 'alertButton',
          handler: () => {
          }
        }, {
          text: 'نعم',
          cssClass: 'alertButton',
          handler: () => {
            this.storage.remove('fullNameLogin');
            this.storage.remove('emailLogin');
            this.router.navigateByUrl('home');
          }
        }
      ]
    });
    await alert.present();
  }
}
