import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharMenu } from './char-menu';

describe('CharMenu', () => {
  let component: CharMenu;
  let fixture: ComponentFixture<CharMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
