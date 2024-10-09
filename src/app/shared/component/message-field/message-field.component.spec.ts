import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFieldComponent } from './message-field.component';

describe('MessageFieldComponent', () => {
  let component: MessageFieldComponent;
  let fixture: ComponentFixture<MessageFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
