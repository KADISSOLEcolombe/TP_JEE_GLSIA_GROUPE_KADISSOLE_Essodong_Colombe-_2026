import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../services/auth.service';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Client Registration</h1>
        
        <form [formGroup]="form" (ngSubmit)="register()" class="space-y-3">
          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">First Name</label>
            <input
              type="text"
              formControlName="prenom"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Last Name</label>
            <input
              type="text"
              formControlName="nom"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Phone</label>
            <input
              type="tel"
              formControlName="telephone"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Address</label>
            <input
              type="text"
              formControlName="adresse"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Birth Date</label>
            <input
              type="date"
              formControlName="dateNaissance"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Gender</label>
            <select
              formControlName="sexe"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Nationality</label>
            <input
              type="text"
              formControlName="nationalité"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1 text-sm">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <button
            type="submit"
            [disabled]="!form.valid || loading()"
            class="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 text-sm mt-4"
          >
            {{ loading() ? 'Creating...' : 'Create Account' }}
          </button>

          <a href="/login-client" class="text-green-600 text-center block hover:underline text-sm">
            Already have an account? Login
          </a>
        </form>

        <div *ngIf="error()" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {{ error() }}
        </div>
        <div *ngIf="success()" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
          {{ success() }}
        </div>
      </div>
    </div>
  `
})
export class RegisterClientComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.minLength(8)]],
    adresse: ['', [Validators.required, Validators.minLength(3)]],
    dateNaissance: ['', Validators.required],
    sexe: ['', Validators.required],
    nationalité: ['', Validators.required],
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

    const data = this.form.value as RegisterRequest;
    this.authService.registerClient(data).subscribe({
      next: () => {
        this.success.set('Account created successfully. Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login-client']), 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
