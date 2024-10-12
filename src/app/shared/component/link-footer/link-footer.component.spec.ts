import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFooterComponent } from './link-footer.component';

describe('LinkFooterComponent', () => {
  let component: LinkFooterComponent;
  let fixture: ComponentFixture<LinkFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
