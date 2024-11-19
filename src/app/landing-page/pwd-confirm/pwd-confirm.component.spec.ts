import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdConfirmComponent } from './pwd-confirm.component';

describe('PwdConfirmComponent', () => {
  let component: PwdConfirmComponent;
  let fixture: ComponentFixture<PwdConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PwdConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
