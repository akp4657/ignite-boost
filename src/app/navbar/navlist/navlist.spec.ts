import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navlist } from './navlist';

describe('Navlist', () => {
  let component: Navlist;
  let fixture: ComponentFixture<Navlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
