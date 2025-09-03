import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLoader } from './image-loader';

describe('ImageLoader', () => {
  let component: ImageLoader;
  let fixture: ComponentFixture<ImageLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
