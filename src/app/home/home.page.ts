import { Component } from '@angular/core';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import { style } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  shoppingList = JSON.parse(localStorage.getItem('items')) || [];

  doneList = JSON.parse(localStorage.getItem('doneitems')) || [];

  constructor(private alertController: AlertController,
    private toastController: ToastController) {}

  async addItem(){
    const alert = await this.alertController.create({
      cssClass: 'customAltert',
      header: 'Add new item',
      buttons: [{
        text: 'Add',
        handler: (textfields) => {
          if(textfields[0].length == 0 || textfields[0].length >= 30){
            this.presentToast('please enter an item or string too long!');
          }
          else {
            this.shoppingList.push(textfields[0]);
            this.save();
          }        
        }
      }],
      inputs: [
        {
          placeholder: 'new item',
        }
      ],
    });

    await alert.present();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  save(){
    let itemsAsText = JSON.stringify(this.shoppingList);
    localStorage.setItem('items', itemsAsText);

  }

  pushItemToDone(i){
    this.doneList.push(this.shoppingList[i]);
    let doneitemsAsText = JSON.stringify(this.doneList);
    localStorage.setItem('doneitems', doneitemsAsText);
  }

  doneItem(i){
    setTimeout(()=>{
      this.pushItemToDone(i);
      this.shoppingList.splice(i, 1);
      this.save();
    }, 500);  
  }

  reverse(i){
    this.pushItemToShoppingList(i);
    this.doneList.splice(i, 1);
    this.save();

  }

  deleteItem(i) {
    this.doneList.splice(i, 1);
    let doneitemsAsText = JSON.stringify(this.doneList);
    localStorage.setItem('doneitems', doneitemsAsText);
    this.presentToast('Item deleted!'); 
  }

  pushItemToShoppingList(i){
    this.shoppingList.push(this.doneList[i]);
    let itemsAsText = JSON.stringify(this.shoppingList);
    localStorage.setItem('items', itemsAsText);
  }

  async deleteDoneList(){
    const alert = await this.alertController.create({
      cssClass: 'customDeleteAltert',
      header: 'Do you want to delete all items?',
      buttons: [{
        text: 'Cancel',
        role:  'cancel',
        handler: () => {console.log('canceled');}
      }, {
        text: 'Delete',
        handler: () => {
          this.doneList = []
          let doneitemsAsText = JSON.stringify(this.doneList);
          localStorage.setItem('doneitems', doneitemsAsText );
          }
      }] 
    }); 
    await alert.present();
  }

  display = 1;

  hideDoneList() {
  
    this.display = 1 - this.display;
  }



}