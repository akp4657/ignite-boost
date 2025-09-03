import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayList } from './replay-list';

describe('ReplayList', () => {
  let component: ReplayList;
  let fixture: ComponentFixture<ReplayList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplayList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
