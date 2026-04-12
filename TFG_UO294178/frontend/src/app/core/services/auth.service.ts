import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AppUser } from '../models/user.model.js';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // La dirección del servidor Node.js
  private API_URL = 'http://localhost:3000/api';

  // --- GESTIÓN DEL ESTADO DEL USUARIO ---
  // Es como una caja que guarda el último valor (el usuario actual) y se lo enseña a quien se suscriba.
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);

  // Esta es la variable pública que escucharán tus Guards y Componentes
  public currentUserProfile$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkSession().subscribe();
  }

  /**
   * INICIAR SESIÓN (Login)
   * Envía email y contraseña al backend.
   * Si es correcto, el navegador guarda la cookie automáticamente.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        // Si el login funciona, el backend nos devuelve el usuario
        if (response.user) {
          const user: AppUser = {
            uid: response.user.id,        // Adaptamos el ID numérico a 'uid'
            email: response.user.email,
            role: response.user.role,
            displayName: response.user.name
          };
          // Guardamos el usuario en nuestra "caja" local
          this.currentUserSubject.next(user);

          // Redirigimos al dashboard
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  /**
   * REGISTRO (ACTIVAR CUENTA)
   * Envía los datos para establecer contraseña y activar el usuario.
   */
    register(data: RegisterData): Observable<any> {
    return this.http.post(
      `${this.API_URL}/register`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * INVITAR USUARIO (Solo Admin)
   * Envía el email del nuevo usuario al backend para que envíe la invitación.
   */
  inviteUser(email: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/admin/invite`,
      { email },
      { withCredentials: true }
    );
  }

  /**
   * CERRAR SESIÓN (Logout)
   * Avisa al backend para destruir la sesión y borra el estado local.
   */
  logout() {
    return this.http.post(
      `${this.API_URL}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null); // Vaciamos la caja
        this.router.navigate(['/login']);
      })
    ).subscribe();
  }

  /**
   * VERIFICAR SESIÓN (Persistencia)
   * Se llama al recargar la página para ver si la cookie sigue siendo válida.
   */
  checkSession(): Observable<AppUser | null> {
    return this.http.get<any>(
      `${this.API_URL}/me`,
      { withCredentials: true }
    ).pipe(
      map(response => {
        if (response.user) {
          const user: AppUser = {
            uid: response.user.id,
            email: response.user.email,
            role: response.user.role,
            displayName: response.user.name
          };
          this.currentUserSubject.next(user); // Restauramos al usuario
          return user;
        }
        return null;
      }),
      catchError(() => {
        // Si el backend da error (401), es que no hay sesión válida
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
}
