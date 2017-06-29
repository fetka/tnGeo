import { Component } from '@angular/core';
import {
  IonicPage, NavController,
  NavParams, PopoverController, ViewController
} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController) {
  }

  
close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
  //  console.log('ionViewDidLoad PopoverPage');
  }

}
