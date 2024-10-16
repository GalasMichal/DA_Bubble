import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAddUsersComponent } from './input-add-users.component';

describe('InputAddUsersComponent', () => {
  let component: InputAddUsersComponent;
  let fixture: ComponentFixture<InputAddUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputAddUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputAddUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
