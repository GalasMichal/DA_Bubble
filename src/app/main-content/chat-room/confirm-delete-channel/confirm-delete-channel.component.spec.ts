import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteChannelComponent } from './confirm-delete-channel.component';

describe('ConfirmDeleteChannelComponent', () => {
  let component: ConfirmDeleteChannelComponent;
  let fixture: ComponentFixture<ConfirmDeleteChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDeleteChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
