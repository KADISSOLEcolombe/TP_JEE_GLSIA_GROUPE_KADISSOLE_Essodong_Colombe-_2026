import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
}

export interface Compte {
  numero: string;
  type: 'COURANT' | 'EPARGNE';
  dateCreation: string;
  solde: number;
  client?: Client;
}

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/comptes';

  getAll(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  getByNumero(numero: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${numero}`);
  }

  create(clientId: number, type: 'COURANT' | 'EPARGNE'): Observable<Compte> {
    return this.http.post<Compte>(`${this.apiUrl}/client/${clientId}?type=${type}`, {});
  }

  update(numero: string, compte: Partial<Compte>): Observable<Compte> {
    return this.http.put<Compte>(`${this.apiUrl}/${numero}`, compte);
  }

  delete(numero: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numero}`);
  }
}
