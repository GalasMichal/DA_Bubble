import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSearchesListComponent } from './recent-searches-list.component';

describe('RecentSearchesListComponent', () => {
  let component: RecentSearchesListComponent;
  let fixture: ComponentFixture<RecentSearchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentSearchesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentSearchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
