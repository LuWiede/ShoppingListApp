import { Component } from '@angular/core';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import { style } from '@angular/animations';

import {ItemReorderEventDetail,IonReorderGroup } from '@ionic/angular';

import { combineLatest }    from 'rxjs';
import { SettingsService }  from '../services/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  shoppingList = JSON.parse(localStorage.getItem('items')) || [];
  doneList = JSON.parse(localStorage.getItem('doneitems')) || [];

  darkMode = false;
  kauflandMode = false;
  nibbsMode = false;

  constructor(private alertController: AlertController,
    private toastController: ToastController,
    private settings: SettingsService) {}

   ngOnInit() {
    this.settings.darkMode$.subscribe(dm => this.darkMode = dm);
    this.settings.kauflandMode$.subscribe(km => this.kauflandMode = km);
    this.settings.nibbsMode$.subscribe(nm => this.nibbsMode = nm);

    console.log('Aktueller Dark Mode:', this.darkMode);
    console.log('Aktueller Kaufland Mode:', this.kauflandMode);
    console.log('Aktueller Nibbs Mode:', this.nibbsMode);
  }

    doReorder(event: any) {
    const from = event.detail.from as number;
    const to   = event.detail.to   as number;
    console.log('REORDER FIRED:', from, '->', to);

    const moved = this.shoppingList.splice(from, 1)[0];
    this.shoppingList.splice(to, 0, moved);
    event.detail.complete();
    localStorage.setItem('items', JSON.stringify(this.shoppingList));
  }

  
    // Hilfsfunktion break nach x Zeichen 
    insertLineBreaks(text: string, interval: number): string {
    return text
      .match(new RegExp(`.{1,${interval}}`, 'g'))  // erzeugt Array von Textblöcken
      ?.join('<br>') || text;                      // gibt nur ein String zurück
  }

  async addItem(){

    const cssClasses = ['customAltert'];

    if (this.darkMode)  { cssClasses.push('dark-mode-page'); }
    if (this.kauflandMode) { cssClasses.push('kaufland-mode-page'); }

    console.log(cssClasses);

    const alert = await this.alertController.create({
      cssClass: cssClasses,
      header: 'Add new item',
      buttons: [{
        text: 'Add',
        handler: (textfields) => {
          if(textfields[0].length == 0 || textfields[0].length > 120){
            this.presentToast('please enter an item or string too long!');
          }
          else {
            const formattedInput = this.insertLineBreaks(textfields[0], 50); //nach 35 Zeichen break
            this.shoppingList.push(formattedInput);
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

  clickedItemIndex: number = -1;

  doneItem(i){

    this.clickedItemIndex = i;

    setTimeout(()=>{
      this.pushItemToDone(i);
      this.shoppingList.splice(i, 1);
      this.save();
      this.clickedItemIndex = -1;
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

    const cssClassesDelete = ['customDeleteAltert'];

    if (this.darkMode)  { cssClassesDelete.push('dark-mode-page'); }
    if (this.kauflandMode) { cssClassesDelete.push('kaufland-mode-page'); }

    console.log(cssClassesDelete)

    const alert = await this.alertController.create({
      cssClass: cssClassesDelete,
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

  display = 0;

  hideDoneList() {
  
    this.display = 1 - this.display;
  }

  goToKaufland(){
    window.open('https://www.google.com/search?client=firefox-b-d&sca_esv=e0d45d95ed44ea21&sxsrf=AE3TifOby_M2kSvGrSZ1CKLjN71bAn4yiQ:1749816532299&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s-ZzatqLITHGtPATujrQPzElP0xZn8AL4SARKd8Ss0Ssit6c0OoqLcFalFYyueQkNicRUQ-Fa9VrIeFHGafRXTBvF2Kae4ImLiBD26gEkdrRdgf-dA%3D%3D&q=Kaufland+Dresden-Nau%C3%9Flitz+Rezensionen&sa=X&ved=2ahUKEwiOudHGru6NAxUvR_EDHYtKH0QQ0bkNegQILBAE&biw=1280&bih=595&dpr=1.5', '_blank');
  }

  async kauflandAngebote() {

    const cssClassesKaufland = ['customKauflandAltert'];

    if (this.darkMode)  { cssClassesKaufland.push('dark-mode-page'); }
    if (this.kauflandMode) { cssClassesKaufland.push('kaufland-mode-page'); }

    console.log(cssClassesKaufland)

    if (this.kauflandMode) {
    const alert = await this.alertController.create({
      cssClass: cssClassesKaufland,
      header: '', 
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => console.log('canceled')
        }
      ]
    });
    await alert.present();
  }
}
}