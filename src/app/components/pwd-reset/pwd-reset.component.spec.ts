import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdResetComponent } from './pwd-reset.component';

describe('PwdResetComponent', () => {
  let component: PwdResetComponent;
  let fixture: ComponentFixture<PwdResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdResetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PwdResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
