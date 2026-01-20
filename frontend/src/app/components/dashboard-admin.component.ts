import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService, Client } from '../services/client.service';
import { CompteService, Compte } from '../services/compte.service';
import { TransactionService, Transaction } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
        <button
          (click)="logout()"
          class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>

      <div class="container mx-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Clients Management -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4 text-blue-900">Manage Clients</h2>

            <div *ngIf="!showClientForm()" class="mb-4">
              <button
                (click)="showClientForm.set(true); resetClientForm()"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                ➕ Add New Client
              </button>
            </div>

            <form *ngIf="showClientForm()" [formGroup]="clientForm" (ngSubmit)="saveClient()" class="space-y-3 mb-4 text-sm">
              <input
                type="text"
                placeholder="First Name"
                formControlName="prenom"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                formControlName="nom"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                formControlName="email"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                formControlName="telephone"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                formControlName="adresse"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                formControlName="dateNaissance"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                formControlName="sexe"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <input
                type="text"
                placeholder="Nationality"
                formControlName="nationalité"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                formControlName="password"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="flex gap-2">
                <button
                  type="submit"
                  [disabled]="!clientForm.valid"
                  class="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Save
                </button>
                <button
                  type="button"
                  (click)="showClientForm.set(false)"
                  class="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="border p-2 text-left">Name</th>
                    <th class="border p-2 text-left">Email</th>
                    <th class="border p-2 text-left">Phone</th>
                    <th class="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let client of clients()" class="border-b hover:bg-gray-50">
                    <td class="border p-2">{{ client.prenom }} {{ client.nom }}</td>
                    <td class="border p-2">{{ client.email }}</td>
                    <td class="border p-2">{{ client.telephone }}</td>
                    <td class="border p-2 text-center">
                      <button
                        (click)="editClient(client)"
                        class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        (click)="deleteClient(client.id!)"
                        class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p *ngIf="clients.length === 0" class="text-center text-gray-500 py-4">No clients found</p>
            </div>
          </div>

          <!-- Accounts Management -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4 text-blue-900">All Accounts</h2>

            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="border p-2 text-left">Account #</th>
                    <th class="border p-2 text-left">Type</th>
                    <th class="border p-2 text-right">Balance</th>
                    <th class="border p-2 text-left">Client</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor=\"let compte of comptes()\" class=\"border-b hover:bg-gray-50\">
                    <td class="border p-2 font-mono text-xs">{{ compte.numero.slice(-8) }}</td>
                    <td class="border p-2">{{ compte.type }}</td>
                    <td class="border p-2 text-right font-semibold">{{ compte.solde | currency }}</td>
                    <td class="border p-2">{{ compte.client?.prenom }} {{ compte.client?.nom }}</td>
                  </tr>
                </tbody>
              </table>
              <p *ngIf="comptes.length === 0" class="text-center text-gray-500 py-4">No accounts found</p>
            </div>
          </div>
        </div>

        <!-- Transactions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4 text-blue-900">Recent Transactions</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-xs border-collapse">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border p-2 text-left">Type</th>
                  <th class="border p-2 text-right">Amount</th>
                  <th class="border p-2 text-left">Date</th>
                  <th class="border p-2 text-left">Source</th>
                  <th class="border p-2 text-left">Destination</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let tx of transactions()" class="border-b hover:bg-gray-50">
                  <td class="border p-2">
                    <span
                      [class.bg-green-100]="tx.type === 'VERSEMENT'"
                      [class.bg-red-100]="tx.type === 'RETRAIT'"
                      [class.bg-blue-100]="tx.type === 'VIREMENT'"
                      class="px-2 py-1 rounded text-xs font-semibold"
                    >
                      {{ tx.type }}
                    </span>
                  </td>
                  <td class="border p-2 text-right font-semibold">{{ tx.montant | currency }}</td>
                  <td class="border p-2">{{ tx.dateTransaction | date: 'short' }}</td>
                  <td class="border p-2 text-xs">
                    {{ (tx.compteSource?.numero?.slice(-6)) || '-' }}
                  </td>
                  <td class="border p-2 text-xs">
                    {{ (tx.compteDestination?.numero?.slice(-6)) || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
            <p *ngIf="transactions().length === 0" class="text-center text-gray-500 py-4">No transactions found</p>
          </div>
        </div>
      </div>
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

  clientForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    adresse: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    sexe: ['', Validators.required],
    nationalité: ['', Validators.required],
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
          alert(err.error?.message || 'Error updating client');
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
          alert(err.error?.message || 'Error creating client');
        }
      });
    }
  }

  editClient(client: Client): void {
    this.editingClientId.set(client.id!);
    this.clientForm.patchValue(client);
    this.showClientForm.set(true);
  }

  deleteClient(id: number): void {
    if (confirm('Are you sure?')) {
      this.clientService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Error deleting client')
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
}
