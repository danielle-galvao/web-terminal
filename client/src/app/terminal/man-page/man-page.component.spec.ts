import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPageComponent } from './man-page.component';

describe('ManPageComponent', () => {
  let component: ManPageComponent;
  let fixture: ComponentFixture<ManPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
