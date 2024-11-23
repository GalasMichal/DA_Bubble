import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSingleUserComponent } from './profile-single-user.component';

describe('ProfileSingleUserComponent', () => {
  let component: ProfileSingleUserComponent;
  let fixture: ComponentFixture<ProfileSingleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSingleUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileSingleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
