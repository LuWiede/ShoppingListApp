import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ListsService } from '../services/lists.service';
import { Router } from '@angular/router';
import { List } from '../model/list.model';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  darkMode = false;
  kauflandMode = false;
  nibbsMode = false;

  private subs: Subscription[] = [];

  shoppingList = JSON.parse(localStorage.getItem('items') || '[]');
  get shoppingCount() { return this.shoppingList?.length ?? 0; }

  lists$: Observable<List[]> = this.lists.lists$;

  //farbauswahl für die Listen die man neu erstellen kann
  readonly COLORS = ['#535399', '#539999', '#997653'];

  constructor(
    private settings: SettingsService,
    private alert: AlertController,
    private toast: ToastController,
    private lists: ListsService,
    private router: Router,
    private menu: MenuController,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.subs.push(
      this.settings.darkMode$.subscribe(v => this.darkMode = v),
      this.settings.kauflandMode$.subscribe(v => this.kauflandMode = v),
      this.settings.nibbsMode$.subscribe(v => this.nibbsMode = v),
    );
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  ionViewWillEnter() {
    this.shoppingList = JSON.parse(localStorage.getItem('items') || '[]');
    this.menu.enable(true);
  }

  cardBg(color: string) {
    return `linear-gradient(135deg, ${color} 0%, ${color}cc 100%, #ffffff22 100%)`;
  }

  open(id: string) {
    this.router.navigate(['/list', id]);
  }

  nonPinned(arr: List[]) {
  return arr.filter(l => !l.pinned);
  }

async addList() {
  const cssClasses = ['customAltert'];
  if (this.darkMode) cssClasses.push('dark-mode-page');
  if (this.kauflandMode) cssClasses.push('kaufland-mode-page');
  if (this.nibbsMode) cssClasses.push('nibbs-mode-page');

  const alert = await this.alert.create({
    cssClass: cssClasses,
    header: 'Create new list',
    inputs: [
      { name: 'title', 
        type: 'text', 
        placeholder: 'List name' ,
        attributes: { maxlength: 30 }}
    ],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Create',
        handler: (data: any) => {
          const raw = String(data?.title ?? '').trim();
          if (!raw) {
            this.presentToast('Please enter a name');
            return false;
          }
          if (raw.length > 30) {
            this.presentToast('Max 30 characters allowed');
            return false;
          }

          const title = raw;

          //ZUFÄLLIGE FARBE auswählen
          const randomColor = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];

          const id = this.lists.add(title, randomColor);
          this.open(id);
          return true;
        }
      }
    ]
  });
  await alert.present();
}

async presentToast(msg: string) {
  const toast = await this.toast.create({
    message: msg,
    duration: 1500,
    position: 'bottom'
  });
  await toast.present();
}

//Funktion die dynamische Liste löscht
async onDeleteList(list: List, ev?: Event) {
  ev?.stopPropagation();

  this.lists.remove(list.id);  
  this.presentToast('List deleted');

  const popover = await this.popoverCtrl.getTop();
  if (popover) await popover.dismiss();
}

//dynamische Listen bearbeiten
async onEditList(list: List, ev?: Event) {
    const cssClasses = ['customAltert'];
      if (this.darkMode) cssClasses.push('dark-mode-page');
      if (this.kauflandMode) cssClasses.push('kaufland-mode-page');
      if (this.nibbsMode) cssClasses.push('nibbs-mode-page');
    ev?.stopPropagation();

    const al = await this.alert.create({
      header: 'Edit list',
      cssClass: cssClasses,
      inputs: [{ name: 'title', type: 'text', value: list.title, placeholder: 'List name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            const title = String(data?.title || '').trim();
            if (!title) { this.presentToast('Please enter a name'); return false; }
            this.lists.updateList({ ...list, title });
            this.presentToast('List updated');
            return true;
          }
        }
      ]
    });
    await al.present();
  }

  reorderLists(ev: any) {
  const from = ev.detail.from as number;
  const to   = ev.detail.to   as number;

  // vollständigen Zustand holen
  const all = this.lists.getAll();
  const pinned    = all.filter(l => l.pinned);
  const nonPinned = all.filter(l => !l.pinned);

  // in nonPinned verschieben
  const moved = nonPinned.splice(from, 1)[0];
  nonPinned.splice(to, 0, moved);

  this.lists.setAll([...pinned, ...nonPinned]);

  ev.detail.complete();
}

}
