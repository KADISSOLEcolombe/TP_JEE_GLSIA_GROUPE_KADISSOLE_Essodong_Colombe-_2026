import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  message: string;
  email: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  sexe: string;
  nationalité: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';
  
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();
  
  private roleSubject = new BehaviorSubject<'admin' | 'client' | null>(this.getRole());
  public role$ = this.roleSubject.asObservable();

  constructor() {}

  loginAdmin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.token, 'admin');
        })
      );
  }

  registerAdmin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/register`, { email, password });
  }

  loginClient(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/client/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.token, 'client');
        })
      );
  }

  registerClient(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/client/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): 'admin' | 'client' | null {
    return (localStorage.getItem('role') as 'admin' | 'client') || null;
  }

  private setToken(token: string, role: 'admin' | 'client'): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.tokenSubject.next(token);
    this.roleSubject.next(role);
  }
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
