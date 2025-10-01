import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFragment } from './code-fragment';

describe('CodeFragment', () => {
  let component: CodeFragment;
  let fixture: ComponentFixture<CodeFragment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFragment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeFragment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
