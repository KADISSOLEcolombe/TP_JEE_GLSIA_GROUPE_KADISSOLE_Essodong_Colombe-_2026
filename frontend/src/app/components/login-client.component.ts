import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Client Login</h1>
        
        <form [formGroup]="form" (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            [disabled]="!form.valid || loading()"
            class="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>

          <a href="/register-client" class="text-green-600 text-center block hover:underline">
            Don't have an account? Register
          </a>
        </form>

        <div *ngIf="error()" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error() }}
        </div>
      </div>
    </div>
  `
})
export class LoginClientComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal('');

  login(): void {
    if (!this.form.valid) return;

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;
    this.authService.loginClient(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard-client']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.statusText || 'Login failed. Please check your credentials.';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }
}
