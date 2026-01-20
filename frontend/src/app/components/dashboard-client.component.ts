import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompteService, Compte } from '../services/compte.service';
import { TransactionService, Transaction, Releve } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-green-900 text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Client Dashboard</h1>
        <button
          (click)="logout()"
          class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>

      <div class="container mx-auto p-6">
        <!-- Accounts Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div *ngFor="let compte of comptes()" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold text-green-900 mb-4">
              {{ compte.type }} Account
            </h3>
            <p class="text-gray-600 text-sm mb-2">Number: <span class="font-mono">{{ compte.numero.slice(-8) }}</span></p>
            <p class="text-3xl font-bold text-green-600 mb-4">{{ compte.solde | currency }}</p>
            <p class="text-xs text-gray-500 mb-6">Created: {{ compte.dateCreation | date }}</p>

            <div class="grid grid-cols-3 gap-2">
              <button
                (click)="selectCompte(compte); showVersement.set(true)"
                class="bg-green-600 text-white px-2 py-2 rounded text-xs hover:bg-green-700"
              >
                Deposit
              </button>
              <button
                (click)="selectCompte(compte); showRetrait.set(true)"
                class="bg-orange-600 text-white px-2 py-2 rounded text-xs hover:bg-orange-700"
              >
                Withdraw
              </button>
              <button
                (click)="selectCompte(compte); showReleve.set(true); loadReleve(compte.numero)"
                class="bg-blue-600 text-white px-2 py-2 rounded text-xs hover:bg-blue-700"
              >
                Statement
              </button>
            </div>
          </div>
        </div>

        <!-- Transfer Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold mb-4 text-green-900">Send Money</h2>

          <div *ngIf="comptes().length < 2" class="text-yellow-600 mb-4">
            You need at least 2 accounts to make transfers.
          </div>

          <form
            *ngIf="comptes().length >= 2"
            [formGroup]="transferForm"
            (ngSubmit)="doVirement()"
            class="space-y-4 max-w-md"
          >
            <div>
              <label class="block text-gray-700 font-medium mb-2">From Account</label>
              <select
                formControlName="sourceNumero"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select source account</option>
                <option *ngFor=\"let c of comptes()\" [value]=\"c.numero\">
                  {{ c.type }} - Balance: {{ c.solde | currency }}
                </option>
              </select>
            </div>

            <div>
              <label class=\"block text-gray-700 font-medium mb-2\">To Account</label>
              <select
                formControlName=\"destNumero\"
                class=\"w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500\"
              >
                <option value=\"\">Select destination account</option>
                <option *ngFor=\"let c of comptes()\" [value]=\"c.numero\">
                  {{ c.type }} - Balance: {{ c.solde | currency }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="50000"
                formControlName="montant"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              [disabled]=\"!transferForm.valid || loading()\"
              class=\"w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400\"
            >
              {{ loading() ? 'Processing...' : 'Transfer' }}
            </button>
          </form>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4 text-green-900">Recent Transactions</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border p-2 text-left">Type</th>
                  <th class="border p-2 text-right">Amount</th>
                  <th class="border p-2 text-left">Date</th>
                  <th class="border p-2 text-left">Details</th>
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
                  <td class="border p-2 text-xs text-gray-600">
                    {{ tx.description }}
                  </td>
                </tr>
              </tbody>
            </table>
            <p *ngIf="transactions.length === 0" class="text-center text-gray-500 py-4">No transactions found</p>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <div *ngIf="showVersement()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class=\"text-xl font-bold mb-4\">Deposit to {{ selectedCompte()?.type }} Account</h3>

          <form [formGroup]="versementForm" (ngSubmit)="doVersement()" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="50000"
                formControlName="montant"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <div class="flex gap-2">
              <button
                type="submit"
                [disabled]=\"!versementForm.valid || loading()\"
                class=\"flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400\"
              >
                {{ loading() ? 'Processing...' : 'Confirm' }}
              </button>
              <button
                type="button"
                (click)="showVersement.set(false)"
                class="flex-1 bg-gray-400 text-white py-2 rounded font-semibold hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="showRetrait()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class=\"text-xl font-bold mb-4\">Withdraw from {{ selectedCompte()?.type }} Account</h3>

          <form [formGroup]="retraitForm" (ngSubmit)="doRetrait()" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="50000"
                formControlName="montant"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <div class="flex gap-2">
              <button
                type="submit"
                [disabled]=\"!retraitForm.valid || loading()\"
                class=\"flex-1 bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 disabled:bg-gray-400\"
              >
                {{ loading() ? 'Processing...' : 'Confirm' }}
              </button>
              <button
                type="button"
                (click)="showRetrait.set(false)"
                class="flex-1 bg-gray-400 text-white py-2 rounded font-semibold hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="showReleve()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Account Statement</h3>
            <button
              (click)=\"showReleve.set(false)\"
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div *ngIf=\"releve()\" class=\"space-y-4\">
            <div class=\"grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded\">
              <div>
                <p class=\"text-gray-600 text-sm\">Account Number</p>
                <p class="font-mono text-lg font-bold">{{ releve()?.numeroCompte?.slice(-8) }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Current Balance</p>
                <p class="text-2xl font-bold text-green-600">{{ releve()?.soldeActuel | currency }}</p>
              </div>
              <div>
                <p class=\"text-gray-600 text-sm\">Total Deposits</p>
                <p class="text-lg font-semibold text-green-600">{{ releve()?.totalDepots | currency }}</p>
              </div>
              <div>
                <p class=\"text-gray-600 text-sm\">Total Withdrawals</p>
                <p class="text-lg font-semibold text-red-600">{{ releve()?.totalRetraits | currency }}</p>
              </div>
            </div>

            <h4 class="font-bold text-lg">Transactions</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="border p-2 text-left">Type</th>
                    <th class="border p-2 text-right">Amount</th>
                    <th class="border p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let tx of releve()?.transactions" class="border-b">
                    <td class="border p-2">{{ tx.type }}</td>
                    <td class="border p-2 text-right font-semibold">{{ tx.montant | currency }}</td>
                    <td class="border p-2">{{ tx.dateTransaction }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              (click)=\"showReleve.set(false)\"
              class="w-full bg-gray-400 text-white py-2 rounded font-semibold hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardClientComponent implements OnInit {
  private compteService = inject(CompteService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  comptes = signal<Compte[]>([]);
  transactions = signal<Transaction[]>([]);
  releve = signal<Releve | null>(null);

  loading = signal(false);
  selectedCompte = signal<Compte | null>(null);
  showVersement = signal(false);
  showRetrait = signal(false);
  showReleve = signal(false);

  versementForm = this.fb.group({
    montant: ['', [Validators.required, Validators.min(0.01), Validators.max(50000)]]
  });

  retraitForm = this.fb.group({
    montant: ['', [Validators.required, Validators.min(0.01), Validators.max(50000)]]
  });

  transferForm = this.fb.group({
    sourceNumero: ['', Validators.required],
    destNumero: ['', Validators.required],
    montant: ['', [Validators.required, Validators.min(0.01), Validators.max(50000)]]
  });

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes.set(data);
        if (data.length > 0) {
          this.loadTransactions(data[0].numero);
        }
      },
      error: (err) => alert(err.error?.message || 'Error loading accounts')
    });
  }

  loadTransactions(compteNumero: string): void {
    this.transactionService.getTransactions(compteNumero).subscribe({
      next: (data) => this.transactions.set(data),
      error: (err) => console.error('Error loading transactions', err)
    });
  }

  selectCompte(compte: Compte): void {
    this.selectedCompte.set(compte);
  }

  doVersement(): void {
    if (!this.versementForm.valid || !this.selectedCompte()) return;
    this.loading.set(true);

    const montant = Number(this.versementForm.get('montant')!.value);
    this.transactionService.versement(this.selectedCompte()!.numero, montant).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Deposit successful!');
        this.showVersement.set(false);
        this.loadComptes();
      },
      error: (err: any) => {
        this.loading.set(false);
        alert(err.error?.message || 'Error processing deposit');
      }
    });
  }

  doRetrait(): void {
    if (!this.retraitForm.valid || !this.selectedCompte()) return;
    this.loading.set(true);

    const montant = Number(this.retraitForm.get('montant')!.value);
    this.transactionService.retrait(this.selectedCompte()!.numero, montant).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Withdrawal successful!');
        this.showRetrait.set(false);
        this.loadComptes();
      },
      error: (err: any) => {
        this.loading.set(false);
        alert(err.error?.message || 'Error processing withdrawal');
      }
    });
  }

  doVirement(): void {
    if (!this.transferForm.valid) return;
    this.loading.set(true);

    const { sourceNumero, destNumero, montant } = this.transferForm.value;
    if (!sourceNumero || !destNumero || !montant) {
      this.loading.set(false);
      return;
    }

    this.transactionService.virement(sourceNumero, destNumero, Number(montant)).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Transfer successful!');
        this.transferForm.reset();
        this.loadComptes();
      },
      error: (err) => {
        this.loading.set(false);
        alert(err.error?.message || 'Error processing transfer');
      }
    });
  }

  loadReleve(compteNumero: string): void {
    this.transactionService.getReleve(compteNumero).subscribe({
      next: (data) => this.releve.set(data),
      error: (err) => alert(err.error?.message || 'Error loading statement')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login-client']);
  }
}
