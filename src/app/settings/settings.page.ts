import { Component, OnInit } from '@angular/core';
import { NavController }  from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

interface Settings {
  dark_mode: boolean;
  kaufland_mode: boolean;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  dark_mode: boolean = JSON.parse(localStorage.getItem('dark_mode') || 'true');
   kaufland_mode: boolean = JSON.parse(localStorage.getItem('kaufland_mode') || 'false');

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    this.settings.darkMode$.subscribe(dm => this.dark_mode = dm);
    this.settings.kauflandMode$.subscribe(km => this.kaufland_mode = km);

     console.log('Aktueller Dark Mode:', this.dark_mode);
     console.log('Aktueller Kaufland Mode:', this.kaufland_mode);
  }

  onDarkToggle(event: any) {
    const newDark = event.detail.checked;
    this.settings.setDarkMode(newDark);

    this.dark_mode = newDark;
    localStorage.setItem('dark_mode', JSON.stringify(newDark));

    this.ensureValidModes(newDark, this.kaufland_mode);
    console.log('Dark Mode is now', newDark);
  }

  onKauflandToggle(event: any) {
    const kaufland = event.detail.checked;

    this.settings.setKauflandMode(kaufland);

    this.kaufland_mode = kaufland;
    localStorage.setItem('kaufland_mode', JSON.stringify(kaufland));

    this.ensureValidModes(kaufland, this.kaufland_mode);
    console.log('Kaufland Mode is now', kaufland);
  }

  private ensureValidModes(dark: boolean, kaufland: boolean): void {
    if (!dark && !kaufland) {
      // Dark-Mode wieder anwerfen – kaufland wird automatisch auf false gesetzt
      this.settings.setDarkMode(true);
      localStorage.setItem('dark_mode', JSON.stringify(true));
      console.warn('Beide Modi waren false – setzte Dark-Mode auf true als Fallback.');
    }
  
}
}
