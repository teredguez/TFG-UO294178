import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { AppUser } from '../../core/models/user.model';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authService = inject(AuthService);
  user$: Observable<AppUser | null> = this.authService.currentUserProfile$;

  logout() {
    this.authService.logout();
  }

  // Obtener la inicial del usuario o 'A' si es admin
  getInitial(user: AppUser): string {
    if (user.role === 'admin') return 'A';

    // Primera letra del nombre.
    const name = user.displayName ;
    return name.charAt(0).toUpperCase();
  }
}
