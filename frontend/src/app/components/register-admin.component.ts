import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Create Admin Account</h1>
        
        <form [formGroup]="form" (ngSubmit)="register()" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@bank.com"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            [disabled]="!form.valid || loading()"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ loading() ? 'Creating...' : 'Create Account' }}
          </button>

          <a href="/login-admin" class="text-blue-600 text-center block hover:underline">
            Already have an account? Login
          </a>
        </form>

        <div *ngIf="error()" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error() }}
        </div>
        <div *ngIf="success()" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ success() }}
        </div>
      </div>
    </div>
  `
})
export class RegisterAdminComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal('');
  success = signal('');

  register(): void {
    if (!this.form.valid) return;

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const { email, password } = this.form.value;
    this.authService.registerAdmin(email!, password!).subscribe({
      next: () => {
        this.success.set('Admin account created successfully. Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login-admin']), 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
