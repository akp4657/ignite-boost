import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearch } from './player-search';

describe('PlayerSearch', () => {
  let component: PlayerSearch;
  let fixture: ComponentFixture<PlayerSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
