import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService, Client } from '../services/client.service';
import { CompteService, Compte } from '../services/compte.service';
import { TransactionService, Transaction } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

type Section = 'clients' | 'accounts' | 'transactions' | 'analytics';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar Menu -->
      <aside class="w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h2 class="font-bold text-gray-900">EgaBank</h2>
              <p class="text-xs text-gray-500">Administration</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 p-4 space-y-2">
          <button
            (click)="activeSection.set('clients')"
            [class]="getSectionClass('clients')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>Clients</span>
            <span *ngIf="clients().length > 0" class="ml-auto bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded-full">
              {{ clients().length }}
            </span>
          </button>

          <button
            (click)="activeSection.set('accounts')"
            [class]="getSectionClass('accounts')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span>Comptes</span>
            <span *ngIf="comptes().length > 0" class="ml-auto bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded-full">
              {{ comptes().length }}
            </span>
          </button>

          <button
            (click)="activeSection.set('transactions')"
            [class]="getSectionClass('transactions')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Transactions</span>
          </button>

          <button
            (click)="activeSection.set('analytics')"
            [class]="getSectionClass('analytics')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span>Analytiques</span>
          </button>
        </nav>

        <!-- User Profile & Logout -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Administrateur</p>
                <p class="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
            <button
              (click)="logout()"
              class="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <!-- Header -->
        <header class="bg-white border-b border-gray-100 px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ getSectionTitle() }}</h1>
              <p class="text-sm text-gray-600">{{ getSectionDescription() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                {{ currentDate | date:'fullDate' }}
              </div>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="p-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Panel - Data Listing -->
            <div class="lg:w-2/3">
              <!-- Clients Section -->
              <div *ngIf="activeSection() === 'clients'" class="space-y-6">
                <!-- Clients List -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900">Liste des Clients</h3>
                      <button
                        (click)="showClientForm.set(true); resetClientForm()"
                        class="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span>Nouveau Client</span>
                      </button>
                    </div>
                  </div>
                  
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comptes</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr *ngFor="let client of clients()" class="hover:bg-gray-50 transition-colors">
                          <td class="px-6 py-4">
                            <div class="flex items-center">
                              <div class="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                                <span class="text-rose-600 font-semibold">{{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}</span>
                              </div>
                              <div>
                                <p class="font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</p>
                                <p class="text-sm text-gray-500">{{ client.nationality }}</p>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="space-y-1">
                              <p class="text-sm text-gray-900">{{ client.email }}</p>
                              <p class="text-sm text-gray-500">{{ client.telephone }}</p>
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-2">
                              <span *ngFor="let compte of getClientAccounts(client.id!)" 
                                    class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {{ compte.type }}
                              </span>
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="flex space-x-2">
                              <button
                                (click)="editClient(client)"
                                class="text-gray-600 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button
                                (click)="deleteClient(client.id!)"
                                class="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p *ngIf="clients().length === 0" class="text-center text-gray-500 py-8">Aucun client trouvé</p>
                  </div>
                </div>
              </div>

              <!-- Accounts Section -->
              <div *ngIf="activeSection() === 'accounts'" class="space-y-6">
                <!-- Accounts List -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div class="p-6 border-b border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900">Tous les Comptes</h3>
                  </div>
                  
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Compte</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr *ngFor="let compte of comptes()" class="hover:bg-gray-50 transition-colors">
                          <td class="px-6 py-4">
                            <div class="font-mono text-sm text-gray-900">{{ formatAccountNumber(compte.numero) }}</div>
                          </td>
                          <td class="px-6 py-4">
                            <span [class]="getAccountTypeClass(compte.type)">
                              {{ compte.type }}
                            </span>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-lg font-semibold text-gray-900">{{ compte.solde | currency:'EUR':'symbol':'1.2-2' }}</div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900">{{ compte.client?.prenom }} {{ compte.client?.nom }}</div>
                            <div class="text-xs text-gray-500">{{ compte.client?.email }}</div>
                          </td>
                          <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Actif
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p *ngIf="comptes().length === 0" class="text-center text-gray-500 py-8">Aucun compte trouvé</p>
                  </div>
                </div>
              </div>

              <!-- Transactions Section -->
              <div *ngIf="activeSection() === 'transactions'" class="space-y-6">
                <!-- Transactions List -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
                      <button class="text-rose-600 hover:text-rose-700 text-sm font-medium">
                        Télécharger le rapport
                      </button>
                    </div>
                  </div>
                  
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr *ngFor="let tx of transactions()" class="hover:bg-gray-50 transition-colors">
                          <td class="px-6 py-4">
                            <span [class]="getTransactionTypeClass(tx.type)">
                              {{ tx.type }}
                            </span>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-lg font-semibold" [class.text-green-600]="tx.type === 'VERSEMENT'" [class.text-red-600]="tx.type === 'RETRAIT'" [class.text-blue-600]="tx.type === 'VIREMENT'">
                              {{ tx.type === 'RETRAIT' ? '-' : '' }}{{ tx.montant | currency:'EUR':'symbol':'1.2-2' }}
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900">{{ tx.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900" *ngIf="tx.compteSource">{{ formatAccountNumber(tx.compteSource.numero) }}</div>
                            <div class="text-xs text-gray-500" *ngIf="tx.compteSource">{{ tx.compteSource.client?.prenom }} {{ tx.compteSource.client?.nom }}</div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900" *ngIf="tx.compteDestination">{{ formatAccountNumber(tx.compteDestination.numero) }}</div>
                            <div class="text-xs text-gray-500" *ngIf="tx.compteDestination">{{ tx.compteDestination.client?.prenom }} {{ tx.compteDestination.client?.nom }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p *ngIf="transactions().length === 0" class="text-center text-gray-500 py-8">Aucune transaction trouvée</p>
                  </div>
                </div>
              </div>

              <!-- Analytics Section -->
              <div *ngIf="activeSection() === 'analytics'" class="space-y-6">
                <!-- Analytics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-semibold text-gray-900">Statistiques Clients</h4>
                      <div class="text-rose-600 bg-rose-50 p-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Total Clients</span>
                        <span class="font-semibold text-gray-900">{{ clients().length }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Clients Actifs</span>
                        <span class="font-semibold text-green-600">{{ getActiveClientsCount() }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-semibold text-gray-900">Aperçu Comptes</h4>
                      <div class="text-rose-600 bg-rose-50 p-2 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Total Comptes</span>
                        <span class="font-semibold text-gray-900">{{ comptes().length }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Solde Total</span>
                        <span class="font-semibold text-gray-900">{{ getTotalBalance() | currency:'EUR':'symbol':'1.2-2' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel - Forms and Actions -->
            <div class="lg:w-1/3">
              <!-- Client Form Panel -->
              <div *ngIf="activeSection() === 'clients' && showClientForm()" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ editingClientId() ? 'Modifier Client' : 'Nouveau Client' }}
                  </h3>
                  <button
                    (click)="resetClientForm()"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form [formGroup]="clientForm" (ngSubmit)="saveClient()" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        formControlName="prenom"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        formControlName="nom"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      formControlName="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      formControlName="telephone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      formControlName="adresse"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      formControlName="dateNaissance"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <select
                      formControlName="sexe"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                    <input
                      type="text"
                      formControlName="nationalité"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Nationalité"
                    />
                  </div>

                  <div *ngIf="!editingClientId()">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      formControlName="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Mot de passe temporaire"
                    />
                  </div>

                  <div class="flex gap-3 pt-4">
                    <button
                      type="submit"
                      [disabled]="!clientForm.valid || loading()"
                      class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    > 
                    {{ loading() ? 'Enregistrement...' : (editingClientId() ? 'Mettre à jour' : 'Créer le client') }}
                    </button>
                    <button
                      type="button"
                      (click)="resetClientForm()"
                      class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>

              <!-- Quick Stats Panel -->
              <div *ngIf="activeSection() !== 'clients' || !showClientForm()" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Aperçu Rapide</h3>
                
                <div class="space-y-6">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600">Clients totaux</span>
                      <span class="font-semibold text-gray-900">{{ clients().length }}</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-rose-500 rounded-full" [style.width.%]="(clients().length / 100) * 100"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600">Comptes actifs</span>
                      <span class="font-semibold text-gray-900">{{ comptes().length }}</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500 rounded-full" [style.width.%]="(comptes().length / 50) * 100"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600">Transactions (30j)</span>
                      <span class="font-semibold text-gray-900">{{ transactions().length }}</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full" [style.width.%]="(transactions().length / 200) * 100"></div>
                    </div>
                  </div>

                  <div class="pt-6 border-t border-gray-100">
                    <h4 class="font-medium text-gray-900 mb-3">Actions Rapides</h4>
                    <div class="space-y-3">
                      <button class="w-full text-left p-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">
                        <div class="flex items-center justify-between">
                          <span class="font-medium">Générer Rapport Mensuel</span>
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                      </button>
                      <button class="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center justify-between">
                          <span class="font-medium">Vérifier Audits</span>
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardAdminComponent implements OnInit {
  private clientService = inject(ClientService);
  private compteService = inject(CompteService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  clients = signal<Client[]>([]);
  comptes = signal<Compte[]>([]);
  transactions = signal<Transaction[]>([]);

  loading = signal(false);
  showClientForm = signal(false);
  editingClientId = signal<number | null>(null);
  activeSection = signal<Section>('clients');
  
  currentDate = new Date();

  clientForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    adresse: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    sexe: ['', Validators.required],
    nationality: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.clientService.getAll().subscribe(data => this.clients.set(data));
    this.compteService.getAll().subscribe(data => {
      this.comptes.set(data);
      // Load recent transactions
      if (data.length > 0) {
        this.transactionService.getTransactions(data[0].numero).subscribe(
          txData => this.transactions.set(txData)
        );
      }
    });
  }

  saveClient(): void {
    if (!this.clientForm.valid) return;
    this.loading.set(true);

    const data = this.clientForm.value as Client;

    if (this.editingClientId()) {
      this.clientService.update(this.editingClientId()!, data).subscribe({
        next: () => {
          this.loading.set(false);
          this.loadData();
          this.resetClientForm();
        },
        error: (err) => {
          this.loading.set(false);
          alert(err.error?.message || 'Erreur lors de la mise à jour du client');
        }
      });
    } else {
      this.clientService.create(data).subscribe({
        next: () => {
          this.loading.set(false);
          this.loadData();
          this.resetClientForm();
        },
        error: (err) => {
          this.loading.set(false);
          alert(err.error?.message || 'Erreur lors de la création du client');
        }
      });
    }
  }

  editClient(client: Client): void {
    this.editingClientId.set(client.id!);
    this.clientForm.patchValue(client);
    this.showClientForm.set(true);
    this.activeSection.set('clients');
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Erreur lors de la suppression du client')
      });
    }
  }

  resetClientForm(): void {
    this.clientForm.reset();
    this.editingClientId.set(null);
    this.showClientForm.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login-admin']);
  }

  getSectionClass(section: Section): string {
    const baseClass = 'flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium';
    return this.activeSection() === section 
      ? `${baseClass} bg-rose-50 text-rose-700` 
      : `${baseClass} text-gray-700 hover:bg-gray-50`;
  }

  getSectionTitle(): string {
    switch (this.activeSection()) {
      case 'clients': return 'Gestion des Clients';
      case 'accounts': return 'Gestion des Comptes';
      case 'transactions': return 'Historique des Transactions';
      case 'analytics': return 'Tableau de Bord Analytique';
      default: return 'Tableau de Bord';
    }
  }

  getSectionDescription(): string {
    switch (this.activeSection()) {
      case 'clients': return 'Gérez les clients et leurs informations personnelles';
      case 'accounts': return 'Consultez et gérez tous les comptes bancaires';
      case 'transactions': return 'Suivez toutes les transactions du système';
      case 'analytics': return 'Statistiques et indicateurs de performance';
      default: return 'Panel d\'administration bancaire';
    }
  }

  getClientAccounts(clientId: number): Compte[] {
    return this.comptes().filter(c => c.client?.id === clientId);
  }

  getActiveClientsCount(): number {
    return this.clients().filter(c => this.getClientAccounts(c.id!).length > 0).length;
  }

  getTotalBalance(): number {
    return this.comptes().reduce((sum, compte) => sum + compte.solde, 0);
  }

  formatAccountNumber(numero: string): string {
    return numero.replace(/(.{4})/g, '$1 ').trim();
  }

  getAccountTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'COURANT': 'px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
      'EPARGNE': 'px-3 py-1 text-xs rounded-full bg-green-100 text-green-800',
      'JEUNE': 'px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800'
    };
    return classes[type] || 'px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800';
  }

  getTransactionTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'VERSEMENT': 'px-3 py-1 text-xs rounded-full bg-green-100 text-green-800',
      'RETRAIT': 'px-3 py-1 text-xs rounded-full bg-red-100 text-red-800',
      'VIREMENT': 'px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800'
    };
    return classes[type] || 'px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800';
  }
}