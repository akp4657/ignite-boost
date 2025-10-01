import { TestBed } from '@angular/core/testing';

import { VideoRequests } from './video-requests';

describe('VideoRequests', () => {
  let service: VideoRequests;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoRequests);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
