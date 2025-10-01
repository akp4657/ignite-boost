import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionSelect } from './version-select';

describe('VersionSelect', () => {
  let component: VersionSelect;
  let fixture: ComponentFixture<VersionSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
