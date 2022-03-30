import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {ModalController, Platform} from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  name:any="";
  fromPrice:any="";
  toPrice:any="";
  disc:any="";
  constructor(private storage: Storage,private platform: Platform,private modalController:ModalController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  closeModel(){
    this.modalController.dismiss({
      "name":this.name,
      "disc":this.disc,
      "fromPrice":this.fromPrice,
      "toPrice":this.toPrice,
    });
  }
  ngOnInit() {}
  async functionSearch(){
    this.modalController.dismiss({
      "name":this.name,
      "disc":this.disc,
      "fromPrice":this.fromPrice,
      "toPrice":this.toPrice,
    })
  }
}
