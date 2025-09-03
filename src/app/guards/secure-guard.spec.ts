import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { secureGuard } from './secure-guard';

describe('secureGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => secureGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
