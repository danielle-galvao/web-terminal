import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCommandComponent } from './history-command.component';

describe('HistoryCommandComponent', () => {
  let component: HistoryCommandComponent;
  let fixture: ComponentFixture<HistoryCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
