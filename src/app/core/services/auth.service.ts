import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  private readonly firebaseUser = toSignal(user(this.auth), { initialValue: null });
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);

  readonly currentUser = computed(() => this.firebaseUser());
  readonly isAuthenticated = computed(() => this.firebaseUser() !== null);
  readonly isLoading = computed(() => this.loading());
  readonly authError = computed(() => this.error());

  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      this.error.set(message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
