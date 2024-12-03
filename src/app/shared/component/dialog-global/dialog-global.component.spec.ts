import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGlobalComponent } from './dialog-global.component';

describe('DialogGlobalComponent', () => {
  let component: DialogGlobalComponent;
  let fixture: ComponentFixture<DialogGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGlobalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
