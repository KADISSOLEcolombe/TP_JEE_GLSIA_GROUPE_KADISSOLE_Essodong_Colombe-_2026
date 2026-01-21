import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white">
  <!-- Header -->
  <header class="border-b border-gray-100">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900">EgaBank</span>
        </div>
        
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-gray-700 hover:text-rose-600 font-medium transition-colors">Particuliers</a>
          <a href="#" class="text-gray-700 hover:text-rose-600 font-medium transition-colors">Professionnels</a>
          <a href="#" class="text-gray-700 hover:text-rose-600 font-medium transition-colors">Entreprises</a>
          <a href="#" class="text-gray-700 hover:text-rose-600 font-medium transition-colors">Aide</a>
        </nav>
        
        <div class="flex items-center space-x-4">
          <button class="text-gray-700 hover:text-rose-600 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          <button class="text-gray-700 hover:text-rose-600 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-6 py-12">
    <div class="max-w-6xl mx-auto">
      <!-- Hero Section -->
      <div class="grid lg:grid-cols-2 gap-12 mb-16">
        <div class="space-y-8">
          <h1 class="text-5xl font-bold text-gray-900 leading-tight">
            La banque qui
            <span class="text-rose-600">s'adapte</span>
            à vos besoins
          </h1>
          
          <p class="text-xl text-gray-600 leading-relaxed">
            Des solutions bancaires sécurisées et innovantes pour gérer vos finances en toute confiance. 
            Accédez à vos comptes où que vous soyez.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            
            
            <button 
              (click)="router.navigate(['/login-client'])"
              class="bg-white border border-gray-300 hover:border-rose-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-colors shadow-sm hover:shadow"
            >
              Accès client
            </button>
          </div>
        </div>
        
        <div class="relative">
          <div class="bg-gradient-to-br from-rose-50 to-white rounded-2xl p-8 shadow-lg">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-gray-900">Accès rapide</h3>
                <div class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
              
              <div class="space-y-4">
                <button 
                  (click)="router.navigate(['/login-admin'])"
                  class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>Espace Administrateur</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
  
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Sécurité maximale</h3>
          <p class="text-gray-600">
            Protection avancée de vos transactions et données personnelles avec cryptage bancaire.
          </p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Transactions instantanées</h3>
          <p class="text-gray-600">
            Effectuez vos virements et paiements en temps réel, 24h/24 et 7j/7.
          </p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Support dédié</h3>
          <p class="text-gray-600">
            Une équipe d'experts à votre écoute pour vous accompagner dans toutes vos démarches.
          </p>
        </div>
      </div>

      <!-- Quick Access Section -->
      <div class="bg-gradient-to-r from-rose-50 to-white rounded-2xl p-12 mb-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Services en ligne</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Gérez l'ensemble de vos opérations bancaires depuis votre espace personnel sécurisé
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <a href="#" class="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow text-center group">
            <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
              <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-900">Vos comptes</span>
          </a>
          
          <a href="#" class="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow text-center group">
            <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
              <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-900">Virements</span>
          </a>
          
          <a href="#" class="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow text-center group">
            <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
              <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-900">Sécurité</span>
          </a>
          
          <a href="#" class="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-shadow text-center group">
            <div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
              <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <span class="font-medium text-gray-900">Assistance</span>
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-gray-100 bg-gray-50">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-6 md:mb-0">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-rose-300 to-rose-400 rounded-lg"></div>
            <span class="text-xl font-bold text-gray-900">EgaBank</span>
          </div>
          <p class="text-gray-600 text-sm mt-2">© 2024 EgaBank. Tous droits réservés.</p>
        </div>
        
        <div class="flex space-x-8">
          <a href="#" class="text-gray-600 hover:text-rose-600 text-sm">Mentions légales</a>
          <a href="#" class="text-gray-600 hover:text-rose-600 text-sm">Confidentialité</a>
          <a href="#" class="text-gray-600 hover:text-rose-600 text-sm">Cookies</a>
          <a href="#" class="text-gray-600 hover:text-rose-600 text-sm">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</div>
  `
})
export class HomeComponent {
  protected router = inject(Router);
}