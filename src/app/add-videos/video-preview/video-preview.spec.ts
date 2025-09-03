import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPreview } from './video-preview';

describe('VideoPreview', () => {
  let component: VideoPreview;
  let fixture: ComponentFixture<VideoPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
