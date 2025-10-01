import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharDropdown } from './char-dropdown';

describe('CharDropdown', () => {
  let component: CharDropdown;
  let fixture: ComponentFixture<CharDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
