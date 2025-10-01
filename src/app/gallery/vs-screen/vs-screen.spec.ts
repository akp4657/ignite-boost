import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsScreen } from './vs-screen';

describe('VsScreen', () => {
  let component: VsScreen;
  let fixture: ComponentFixture<VsScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
