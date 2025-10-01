import { TestBed } from '@angular/core/testing';

import { CheckBreakpoints } from './check-breakpoints';

describe('CheckBreakpoints', () => {
  let service: CheckBreakpoints;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckBreakpoints);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
