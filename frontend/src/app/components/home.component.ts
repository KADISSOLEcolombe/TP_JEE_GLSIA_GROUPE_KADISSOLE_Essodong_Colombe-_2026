import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div class="text-center max-w-2xl">
        <h1 class="text-5xl font-bold text-white mb-6">🏦 Banking System</h1>
        <p class="text-xl text-gray-300 mb-12">
          Secure and efficient banking management for admins and clients
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            (click)="router.navigate(['/login-admin'])"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105"
          >
            👨‍💼 Admin Login
          </button>
          <button
            (click)="router.navigate(['/login-client'])"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105"
          >
            👤 Client Login
          </button>
        </div>

        <div class="mt-12 text-gray-400 text-sm">
          <p>Demo Credentials:</p>
          <p class="mt-2">Admin: admin@bank.com / admin123</p>
          <p>Client: Create account from login page</p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  protected router = inject(Router);
}
