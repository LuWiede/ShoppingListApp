import { Component, ViewChild } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

@ViewChild(IonRouterOutlet) outlet;

  constructor(private platform:Platform) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if(!this.outlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }
}
