import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div class="absolute top-6 left-6">
        <button 
          (click)="goToHome()"
          class="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium transition-colors group"
        >
          <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Retour à l'accueil</span>
        </button>
      </div>
    <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <!-- Left side - Branding and Information -->
        <div class="w-full lg:w-1/2 max-w-xl">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-900">PrivaBank</span>
          </div>

          <h1 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Accès Administrateur
            <span class="block text-rose-600">Sécurisé</span>
          </h1>

          <div class="space-y-6">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Authentification requise</h3>
                  <p class="text-gray-600 text-sm">
                    Cet espace est réservé aux administrateurs autorisés. 
                    Toute tentative d'accès non autorisé sera enregistrée.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white rounded-xl p-5 border border-gray-100">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Chiffrement SSL</span>
                </div>
              </div>
              
              <div class="bg-white rounded-xl p-5 border border-gray-100">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">2FA Disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Login Form -->
        <div class="w-full lg:w-1/2 max-w-md">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <!-- Form Header -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Identification Administrateur</h2>
                  <p class="text-gray-300 text-sm">Entrez vos identifiants de sécurité</p>
                </div>
              </div>
            </div>

            <!-- Form Content -->
            <div class="p-8">
              <form [formGroup]="form" (ngSubmit)="login()" class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-medium mb-3">Adresse email</label>
                  <div class="relative">
                    <input
                      type="email"
                      formControlName="email"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="admin@privabank.com"
                      [class.border-red-300]="form.get('email')?.invalid && form.get('email')?.touched"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 011.11 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="mt-2 text-sm text-red-600">
                    Une adresse email valide est requise
                  </div>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-3">Mot de passe</label>
                  <div class="relative">
                    <input
                      type="password"
                      formControlName="password"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      [class.border-red-300]="form.get('password')?.invalid && form.get('password')?.touched"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                  <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="mt-2 text-sm text-red-600">
                    Le mot de passe doit contenir au moins 6 caractères
                  </div>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" id="remember" class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
                  <label for="remember" class="ml-2 text-sm text-gray-600">
                    Se souvenir de moi sur cet appareil
                  </label>
                </div>

                <button
                  type="submit"
                  [disabled]="!form.valid || loading()"
                  class="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  <div class="flex items-center justify-center space-x-2">
                    <span>{{ loading() ? 'Connexion en cours...' : 'Se connecter' }}</span>
                    <svg *ngIf="!loading()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </div>
                </button>

                <div class="pt-4 border-t border-gray-100">
                  <a 
                    href="/register-admin" 
                    class="text-rose-600 hover:text-rose-700 text-center block text-sm font-medium hover:underline transition-colors"
                  >
                    Demander un accès administrateur
                  </a>
                </div>
              </form>

              <div *ngIf="error()" class="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-red-800">Erreur d'authentification</p>
                    <p class="text-sm text-red-700 mt-1">{{ error() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Note -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              <svg class="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
              </svg>
              Toutes les connexions sont sécurisées et enregistrées
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginAdminComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal('');
  
 goToHome(): void {
    this.router.navigate(['/']);
  }
  login(): void {
    if (!this.form.valid) return;

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;
    this.authService.loginAdmin(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard-admin']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.statusText || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }
}