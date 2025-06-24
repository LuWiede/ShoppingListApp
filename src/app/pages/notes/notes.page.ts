import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  NotesList = JSON.parse(localStorage.getItem('itemsNotes')) || [];
  doneNotesList = JSON.parse(localStorage.getItem('doneitemsNotes')) || [];

  darkMode = false;
  kauflandMode = false;
  nibbsMode = false;

    constructor(private settings: SettingsService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  this.settings.darkMode$.subscribe(dm => this.darkMode = dm);
    this.settings.kauflandMode$.subscribe(km => this.kauflandMode = km);
    this.settings.nibbsMode$.subscribe(nm => this.nibbsMode = nm);

    console.log('Dark Mode:', this.darkMode);
    console.log('Kaufland Mode:', this.kauflandMode);
    console.log('Nibbs Mode:', this.nibbsMode);

  }

  doReorder(event: any) {
    const from = event.detail.from as number;
    const to   = event.detail.to   as number;
    console.log('REORDER FIRED:', from, '->', to);

    const moved = this.NotesList.splice(from, 1)[0];
    this.NotesList.splice(to, 0, moved);
    event.detail.complete();
    localStorage.setItem('itemsNotes', JSON.stringify(this.NotesList));
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
            const formattedInput = this.insertLineBreaks(textfields[0], 50); //nach 50 Zeichen break
            this.NotesList.push(formattedInput);
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
    let itemsAsText = JSON.stringify(this.NotesList);
    localStorage.setItem('itemsNotes', itemsAsText);

  }

  pushItemToDone(i){
    this.doneNotesList.push(this.NotesList[i]);
    let doneitemsAsText = JSON.stringify(this.doneNotesList);
    localStorage.setItem('doneitemsNotes', doneitemsAsText);
  }

  clickedItemIndex: number = -1;

  doneItem(i){

    this.clickedItemIndex = i;

    setTimeout(()=>{
      this.pushItemToDone(i);
      this.NotesList.splice(i, 1);
      this.save();
      this.clickedItemIndex = -1;
    }, 500); 
  }

  reverse(i){
    this.pushItemToShoppingList(i);
    this.doneNotesList.splice(i, 1);
    this.save();

  }

  deleteItem(i) {
    this.doneNotesList.splice(i, 1);
    let doneitemsAsText = JSON.stringify(this.doneNotesList);
    localStorage.setItem('doneitemsNotes', doneitemsAsText);
    this.presentToast('Item deleted!'); 
  }

  pushItemToShoppingList(i){
    this.NotesList.push(this.doneNotesList[i]);
    let itemsAsText = JSON.stringify(this.NotesList);
    localStorage.setItem('itemsNotes', itemsAsText);
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
          this.doneNotesList = []
          let doneitemsAsText = JSON.stringify(this.doneNotesList);
          localStorage.setItem('doneitemsNotes', doneitemsAsText );
          }
      }] 
    }); 
    await alert.present();
  }

  display = 0;

  hideDoneList() {
  
    this.display = 1 - this.display;
  }

}
