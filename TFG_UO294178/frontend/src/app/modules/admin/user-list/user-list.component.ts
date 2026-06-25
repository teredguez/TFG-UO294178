import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MaterialModule } from '../../../core/material/material-module';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  users: any[] = [];
  isLoading = true;
  errorMessage = '';

  get activeUsers() {
    return this.users.filter((user) => user.active);
  }

  get pendingUsers() {
    return this.users.filter((user) => !user.active);
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los usuarios.';
        this.isLoading = false;
      },
    });
  }

  exit(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  deleteUser(id: number, name: string): void {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Dar de baja usuario',
      message: `¿Está seguro de que desea dar de baja al usuario "${name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Dar de baja',
      cancelText: 'Cancelar',
      showCancel: true
    }
  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {
      return;
    }

    this.authService.deleteUser(id).subscribe({

      next: () => {

        this.users = this.users.filter(
          user => user.id !== id
        );

      },

      error: () => {

        this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data: {
            title: 'Error',
            message: 'No se pudo dar de baja al usuario.',
            confirmText: 'Aceptar',
            showCancel: false
          }
        });

      }

    });

  });

}
}

