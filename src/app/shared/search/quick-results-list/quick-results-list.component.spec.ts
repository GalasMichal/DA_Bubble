import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickResultsListComponent } from './quick-results-list.component';

describe('QuickResultsListComponent', () => {
  let component: QuickResultsListComponent;
  let fixture: ComponentFixture<QuickResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickResultsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
