import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MessageComponentModule } from '../message/message.module';

import { ListsPage } from './lists.page';

describe('ListsPage', () => {
  let component: ListsPage;
  let fixture: ComponentFixture<ListsPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
          declarations: [ListsPage],
          imports: [IonicModule.forRoot(), MessageComponentModule, RouterModule.forRoot([])]
        }).compileComponents();
    
        fixture = TestBed.createComponent(ListsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
