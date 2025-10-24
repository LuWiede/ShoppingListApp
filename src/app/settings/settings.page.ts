import { Component, OnInit } from '@angular/core';
import { NavController }  from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { MenuController } from '@ionic/angular';

interface Settings {
    dark_mode: boolean;
      kaufland_mode: boolean;
        nibbs_mode: boolean;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  dark_mode: boolean = JSON.parse(localStorage.getItem('dark_mode') || 'true');
  kaufland_mode: boolean = JSON.parse(localStorage.getItem('kaufland_mode') || 'false');
  nibbs_mode: boolean = JSON.parse(localStorage.getItem('nibbs_mode') || 'false');

  constructor(private settings: SettingsService,
              private menu: MenuController
  ) {}

  ngOnInit() {
    this.settings.darkMode$.subscribe(dm => this.dark_mode = dm);
    this.settings.kauflandMode$.subscribe(km => this.kaufland_mode = km);
    this.settings.nibbsMode$.subscribe(nm => this.nibbs_mode = nm);

     console.log('Aktueller Dark Mode:', this.dark_mode);
     console.log('Aktueller Kaufland Mode:', this.kaufland_mode);
     console.log('Nibbs Mode:', this.nibbs_mode);
  }

onDarkToggle(event: any) {
  const isDark = event.detail.checked;

  // Dark Mode aktivieren oder ausschalten
  this.dark_mode = isDark;
  this.settings.setDarkMode(isDark);
  localStorage.setItem('dark_mode', JSON.stringify(isDark));

  // Kaufland ist dann automatisch das Gegenteil
  const isKaufland = !isDark;
  this.kaufland_mode = isKaufland;
  this.settings.setKauflandMode(isKaufland);
  localStorage.setItem('kaufland_mode', JSON.stringify(isKaufland));
  }

  // wird nicht mehr gebraucht 
  onKauflandToggle(event: any) {
    const kaufland = event.detail.checked;

    this.settings.setKauflandMode(kaufland);

    this.kaufland_mode = kaufland;
    localStorage.setItem('kaufland_mode', JSON.stringify(kaufland));

    this.ensureValidModes(kaufland, this.kaufland_mode);
    console.log('Kaufland Mode is now', kaufland);
  }

  onNibbsToggle(event: any) {
    const nibbs = event.detail.checked;

    this.settings.setNibbsMode(nibbs);

    this.nibbs_mode = nibbs;
    localStorage.setItem('nibbs_mode', JSON.stringify(nibbs));
    console.log('Nibbs Mode is now', nibbs);
  }

  private ensureValidModes(dark: boolean, kaufland: boolean): void {
    if (!dark && !kaufland) {
      // Dark-Mode wieder anwerfen – kaufland wird automatisch auf false gesetzt
      this.settings.setDarkMode(true);
      localStorage.setItem('dark_mode', JSON.stringify(true));
      console.warn('Beide Modi waren false – setzte Dark-Mode auf true als Fallback.');
    }
}

// Menü ist auf Seite deaktiviert
ionViewWillEnter() {
  this.menu.enable(false);
}

}
