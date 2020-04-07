import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import { BackendService } from '../backend.service';
import { AuthPageComponent } from './auth-page.component';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let debugElement: DebugElement;
  let backendService: BackendService;
  let spy;
  let mockRouter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthPageComponent ],
      //imports: [RouterModule.forRoot([])]
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPageComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;

    backendService = TestBed.inject(BackendService);

    mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') }
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate if succeeded', () => {
    spy = spyOn(backendService, 'authenticate').and.returnValue(of(true));
  
    fixture.detectChanges();
    let authenticated = component.authenticate();
    fixture.detectChanges();
    expect(authenticated).toBeFalsy();
    expect(spy).toHaveBeenCalled();
    let errorHTML = component.error.nativeElement.innerHTML;
    expect(errorHTML).not.toEqual('Failed to authenticate');
    expect(errorHTML).toEqual('');
  });
    
  it('should fail to authenticate if not succeeded', () => {
    spy = spyOn(backendService, 'authenticate').and.returnValue(of(false));
  
    fixture.detectChanges();
    let authenticated = component.authenticate();
    fixture.detectChanges();
    expect(authenticated).toBeFalsy();
    expect(spy).toHaveBeenCalled();
    let errorHTML = component.error.nativeElement.innerHTML;
    expect(errorHTML).toEqual('Failed to authenticate');
  });
});
