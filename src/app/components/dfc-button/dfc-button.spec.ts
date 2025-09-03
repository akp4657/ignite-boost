import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcButton } from './dfc-button';

describe('DfcButton', () => {
  let component: DfcButton;
  let fixture: ComponentFixture<DfcButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfcButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DfcButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
