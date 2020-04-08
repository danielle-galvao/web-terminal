import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { HistoryComponent } from './history.component';
import { BackendService } from 'src/app/backend.service';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let spy;
  let backendService: BackendService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    component.commandId = {};
    fixture.detectChanges();
    backendService = TestBed.inject(BackendService);

    spy = spyOn(backendService, 'getHistoryFor').withArgs(123).and.returnValue('ls');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle output', () => {
    expect(component.show).toBeFalsy();
    component.toggleOutput();
    expect(component.show).toBeTruthy();
  });

});
