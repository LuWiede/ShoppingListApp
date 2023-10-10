import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DayplannerPageRoutingModule } from './dayplanner-routing.module';

import { DayplannerPage } from './dayplanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DayplannerPageRoutingModule
  ],
  declarations: [DayplannerPage]
})
export class DayplannerPageModule {}
