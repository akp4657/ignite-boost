import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSelect } from './char-select';

describe('CharSelect', () => {
  let component: CharSelect;
  let fixture: ComponentFixture<CharSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
