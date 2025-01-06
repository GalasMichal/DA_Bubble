import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageImageComponent } from './message-image.component';

describe('MessageImageComponent', () => {
  let component: MessageImageComponent;
  let fixture: ComponentFixture<MessageImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
