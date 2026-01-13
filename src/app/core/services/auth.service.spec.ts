import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuth = {
    onAuthStateChanged: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Auth, useValue: mockAuth }],
    });

    service = TestBed.inject(AuthService);
  });

  describe('initial state', () => {
    it('should be created', () => {
      // #given - service is injected
      // #when - (no action needed)
      // #then
      expect(service).toBeTruthy();
    });

    it('should have isAuthenticated as false initially', () => {
      // #given - service just created
      // #when - (no action needed)
      // #then
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should have isLoading as false initially', () => {
      // #given - service just created
      // #when - (no action needed)
      // #then
      expect(service.isLoading()).toBe(false);
    });

    it('should have no error initially', () => {
      // #given - service just created
      // #when - (no action needed)
      // #then
      expect(service.authError()).toBeNull();
    });
  });
});
