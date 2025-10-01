import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfo } from './match-info';

describe('MatchInfo', () => {
  let component: MatchInfo;
  let fixture: ComponentFixture<MatchInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
