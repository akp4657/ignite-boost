import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEmbed } from './video-embed';

describe('VideoEmbed', () => {
  let component: VideoEmbed;
  let fixture: ComponentFixture<VideoEmbed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEmbed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEmbed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
