import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionCloudComponent } from './reaction-cloud.component';

describe('ReactionCloudComponent', () => {
  let component: ReactionCloudComponent;
  let fixture: ComponentFixture<ReactionCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionCloudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
