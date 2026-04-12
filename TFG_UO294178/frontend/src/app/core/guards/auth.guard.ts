import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Llamamos a checkSession() para verificar con el backend si la cookie es válida
  return authService.checkSession().pipe(
    map(user => {
      if (user) {
        // Si el backend devuelve un usuario, dejamos pasar
        return true;
      } else {
        // Si no hay usuario, redirigimos al login
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      // Si hay cualquier error de conexión, redirigimos al login
      router.navigate(['/login']);
      return of(false);
    })
  );
};
