import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SettingsService } from '../services/settings.service';
import { ListsService } from '../services/lists.service';
import { List } from '../model/list.model';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss']
})
export class ListDetailPage implements OnInit, OnDestroy {

  list: List; // dynamische Liste
  darkMode = false;
  kauflandMode = false;
  nibbsMode = false;

  display = 0; // Done-Liste zeigen/verstecken
  clickedItemIndex = -1;

  private subs: Subscription[] = [];

   trackByIndex = (index: number) => index;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private settings: SettingsService,
    private route: ActivatedRoute,
    private lists: ListsService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.settings.darkMode$.subscribe(v => this.darkMode = v),
      this.settings.kauflandMode$.subscribe(v => this.kauflandMode = v),
      this.settings.nibbsMode$.subscribe(v => this.nibbsMode = v),
    );

    const id = this.route.snapshot.paramMap.get('id')!;
    const found = this.lists.getById(id);
    if (!found) { history.back(); return; }

    this.list = JSON.parse(JSON.stringify(found));
    if (!Array.isArray(this.list.doneItems)) this.list.doneItems = [];
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  private save() {
    this.lists.updateList(this.list);
  }

  // Hilfsfunktion: Zeilenumbruch nach x Zeichen
   insertLineBreaks(text: string, interval: number): string {
      let result = "";
      let remaining = text;

      while (remaining.length > interval) {
        const cutIndex = remaining.lastIndexOf(" ", interval);
        const indexToCut = cutIndex > -1 ? cutIndex : interval;

        result += remaining.slice(0, indexToCut) + "<br>";
        remaining = remaining.slice(indexToCut).replace(/^\s+/, "");
      }

      return result + remaining;
    }

  async addItem() {
    const cssClasses = ['customAltert'];
    if (this.darkMode) cssClasses.push('dark-mode-page');
    if (this.kauflandMode) cssClasses.push('kaufland-mode-page');

    const alert = await this.alertController.create({
      cssClass: cssClasses,
      header: 'Add new item',
      inputs: [{ name: 'item', type: 'text', placeholder: 'new item' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (fields: { item?: string }) => {
            const v = String(fields?.item || '').trim();
            if (!v || v.length > 120) {
              this.presentToast('please enter an item or string too long!');
              return false; // verhindert das automatische Schließen
            }

            this.list.items.push(this.insertLineBreaks(v, 35));
            this.save();
            this.presentToast('new Item added');

            // Alert schließen und sofort neu öffnen, dann ist das Feld leer
            setTimeout(async () => {
              await alert.dismiss();
              this.addItem();
            }, 0);

            return false; // wir schließen manuell
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({ message: msg, duration: 1500, position: 'bottom' });
    await toast.present();
  }

  // Item von offen nach done verschieben
  doneItem(i: number) {
    this.clickedItemIndex = i;
    setTimeout(() => {
      this.list.doneItems!.push(this.list.items[i]);
      this.list.items.splice(i, 1);
      this.clickedItemIndex = -1;
      this.save();
    }, 500);
  }

  // aus Done zurückholen
  reverse(i: number) {
    this.list.items.push(this.list.doneItems![i]);
    this.list.doneItems!.splice(i, 1);
    this.save();
  }

  // offenes Item bearbeiten
  async editItem(i: number) {
    const cssClasses = ['customAltert'];
    if (this.darkMode) cssClasses.push('dark-mode-page');
    if (this.kauflandMode) cssClasses.push('kaufland-mode-page');

    const current = String(this.list.items[i] ?? '').replace(/<br>/g, '');
    const alert = await this.alertController.create({
      header: 'Edit item',
      cssClass: cssClasses,
      inputs: [{ name: 'value', type: 'text', value: current, placeholder: 'item' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            const val = (data?.value || '').trim();
            if (!val || val.length > 120) { this.presentToast('please enter an item or string too long!'); return false; }
            this.list.items[i] = this.insertLineBreaks(val, 35);
            this.save();
            this.presentToast('Item updated!');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // offenes Item löschen
  deleteShoppingItem(i: number) {
    this.list.items.splice(i, 1);
    this.save();
    this.presentToast('Item deleted!');
  }

  // Done-Liste komplett löschen
  async deleteDoneList() {
    this.list.doneItems = []; this.save();
  }

  // Done-Bereich ein/aus
  hideDoneList() { this.display = 1 - this.display; }

 doReorder(event: any) {
  const from = event.detail.from as number;
  const to   = event.detail.to   as number;

  const moved = this.list.items.splice(from, 1)[0];
  this.list.items.splice(to, 0, moved);

  event.detail.complete();
  this.save();
}


     goToKaufland(){
      window.open('https://www.google.com/search?client=firefox-b-d&sca_esv=e0d45d95ed44ea21&sxsrf=AE3TifOby_M2kSvGrSZ1CKLjN71bAn4yiQ:1749816532299&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s-ZzatqLITHGtPATujrQPzElP0xZn8AL4SARKd8Ss0Ssit6c0OoqLcFalFYyueQkNicRUQ-Fa9VrIeFHGafRXTBvF2Kae4ImLiBD26gEkdrRdgf-dA%3D%3D&q=Kaufland+Dresden-Nau%C3%9Flitz+Rezensionen&sa=X&ved=2ahUKEwiOudHGru6NAxUvR_EDHYtKH0QQ0bkNegQILBAE&biw=1280&bih=595&dpr=1.5', '_blank');
    }
    
}
