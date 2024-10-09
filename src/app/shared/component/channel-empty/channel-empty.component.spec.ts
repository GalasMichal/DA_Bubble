import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelEmptyComponent } from './channel-empty.component';

describe('ChannelEmptyComponent', () => {
  let component: ChannelEmptyComponent;
  let fixture: ComponentFixture<ChannelEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelEmptyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
