import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authOutGuard } from './auth-out-guard';

describe('authOutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authOutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
