import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayplannerPage } from './dayplanner.page';

describe('DayplannerPage', () => {
  let component: DayplannerPage;
  let fixture: ComponentFixture<DayplannerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DayplannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
