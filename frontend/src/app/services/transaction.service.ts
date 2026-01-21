import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompteInfo {
client: any;
  numero: string;
  type: 'COURANT' | 'EPARGNE';
  solde: number;
}

export interface Transaction {
  id: number;
  type: 'VERSEMENT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction: string;
  compteSource: CompteInfo | null;
  compteDestination: CompteInfo | null;
  description: string;
}

export interface Releve {
  numeroCompte: string;
  typeCompte: string;
  clientNom: string;
  clientPrenom: string;
  dateGeneration: string;
  soldeActuel: number;
  totalDepots: number;
  totalRetraits: number;
  totalVirementsEnvoyes: number;
  totalVirementsRecus: number;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bank';

  versement(compteNumero: string, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/versement?compteNumero=${compteNumero}&montant=${montant}`,
      {}
    );
  }

  retrait(compteNumero: string, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/retrait?compteNumero=${compteNumero}&montant=${montant}`,
      {}
    );
  }

  virement(sourceNumero: string, destNumero: string, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/virement?sourceNumero=${sourceNumero}&destNumero=${destNumero}&montant=${montant}`,
      {}
    );
  }

  getTransactions(compteNumero: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/${compteNumero}`);
  }

  getTransactionsPeriode(compteNumero: string, debut: string, fin: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/transactions/${compteNumero}/periode?debut=${debut}&fin=${fin}`
    );
  }

  getReleve(compteNumero: string): Observable<Releve> {
    return this.http.get<Releve>(`${this.apiUrl}/releve/${compteNumero}`);
  }

  getRelevePeriode(compteNumero: string, debut: string, fin: string): Observable<Releve> {
    return this.http.get<Releve>(
      `${this.apiUrl}/releve/${compteNumero}/periode?debut=${debut}&fin=${fin}`
    );
  }
}
