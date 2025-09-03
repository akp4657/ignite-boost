import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistSelect } from './assist-select';

describe('AssistSelect', () => {
  let component: AssistSelect;
  let fixture: ComponentFixture<AssistSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
