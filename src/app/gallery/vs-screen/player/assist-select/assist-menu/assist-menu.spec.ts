import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistMenu } from './assist-menu';

describe('AssistMenu', () => {
  let component: AssistMenu;
  let fixture: ComponentFixture<AssistMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
