import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalPageComponent } from './terminal-page.component';
import { BackendService } from 'src/app/backend.service';

describe('TerminalPageComponent', () => {
  let component: TerminalPageComponent;
  let fixture: ComponentFixture<TerminalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
