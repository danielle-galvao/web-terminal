import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { of } from 'rxjs';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should access with isAuthenticated', () => {
    expect(service.isAuthenticated()).toEqual(service.authenticated$);
  });

  it('should try to authenticate', () => {
    spyOn(console, 'log');
    service.authenticate('test');
    expect(console.log).toHaveBeenCalledWith('Submitting token test to backend');
    // TODO: try to test the pipe result?... maybe export ofType from backend.service
  });

  it('should try to send to backend', () => {
    spyOn(console, 'log');
    service.sendCommand('test');
    expect(console.log).toHaveBeenCalledWith('Submitting command test to backend');
    // TODO: try to test the return?
  });
});
