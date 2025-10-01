import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayInfo } from './replay-info';

describe('ReplayInfo', () => {
  let component: ReplayInfo;
  let fixture: ComponentFixture<ReplayInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplayInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
