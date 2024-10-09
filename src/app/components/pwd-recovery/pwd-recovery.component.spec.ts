import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdRecoveryComponent } from './pwd-recovery.component';

describe('PwdRecoveryComponent', () => {
  let component: PwdRecoveryComponent;
  let fixture: ComponentFixture<PwdRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdRecoveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PwdRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
