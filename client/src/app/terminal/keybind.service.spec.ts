import { TestBed } from '@angular/core/testing';

import { KeybindService } from './keybind.service';

describe('KeybindService', () => {
  let service: KeybindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeybindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
