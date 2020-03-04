import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOutputComponent } from './history-output.component';

describe('HistoryOutputComponent', () => {
  let component: HistoryOutputComponent;
  let fixture: ComponentFixture<HistoryOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOutputComponent);
    component = fixture.componentInstance;
    component.output = "";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
