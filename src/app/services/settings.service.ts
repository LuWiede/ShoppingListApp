import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private darkModeSub = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('dark_mode') || 'true')
  );

  private kauflandModeSub = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('kaufland_mode') || 'false')
  );

   private nibbsModeSub = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('nibbs_mode') || 'false')
  );

  darkMode$ = this.darkModeSub.asObservable();
  kauflandMode$ = this.kauflandModeSub.asObservable();
  nibbsMode$ = this.nibbsModeSub.asObservable();

  constructor() {
    const dark = this.darkModeSub.value;
    const kaufland = this.kauflandModeSub.value;
    const nibbs = this.nibbsModeSub.value;

    if (!dark && !kaufland) {
      console.warn('Beide Modi waren false – aktiviere DarkMode als Fallback');
      this.setDarkMode(true);
    }

    if (dark && kaufland) {
      console.warn('Beide Modi waren true – deaktiviere KauflandMode');
      this.setKauflandMode(false);
    }
  }

  setDarkMode(on: boolean) {
    if (!on && !this.kauflandModeSub.value) {
      console.warn('DarkMode darf nicht deaktiviert werden, wenn KauflandMode aus ist.');
      this.setKauflandMode(true);
      return;
    }

    this.darkModeSub.next(on);
    localStorage.setItem('dark_mode', JSON.stringify(on));

    if (on) {
      this.setKauflandMode(false);
    }
  }

  setKauflandMode(on: boolean) {
    if (!on && !this.darkModeSub.value) {
      console.warn('KauflandMode darf nicht deaktiviert werden, wenn DarkMode aus ist.');
      this.setKauflandMode(true);
      return;
    }

    this.kauflandModeSub.next(on);
    localStorage.setItem('kaufland_mode', JSON.stringify(on));

    if (on) {
      this.setDarkMode(false);
    }
  }

  setNibbsMode(on: boolean) {

    this.nibbsModeSub.next(on);
    localStorage.setItem('nibbs_mode', JSON.stringify(on));

  }
}
