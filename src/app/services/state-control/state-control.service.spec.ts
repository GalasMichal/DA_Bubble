import { TestBed } from '@angular/core/testing';
import { StateControlService } from './state-control.service';



describe('StateControlService', () => {
  let service: StateControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
