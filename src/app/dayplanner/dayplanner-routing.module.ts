import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayplannerPage } from './dayplanner.page';

const routes: Routes = [
  {
    path: '',
    component: DayplannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayplannerPageRoutingModule {}
