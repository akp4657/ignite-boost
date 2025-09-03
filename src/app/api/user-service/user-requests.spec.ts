import { TestBed } from '@angular/core/testing';

import { UserRequests } from './user-requests';

describe('UserRequests', () => {
  let service: UserRequests;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRequests);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
