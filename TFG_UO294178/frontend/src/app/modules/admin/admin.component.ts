import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  inviteForm: FormGroup;
  isLoading = false;
  message: { text: string, type: 'success' | 'error' } | null = null;

  constructor() {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.sergasEmailValidator]]
    });
  }

  // Validador para el dominio
  sergasEmailValidator(control: any) {
    const email = control.value;
    if (email && !email.endsWith('@sergas.es')) {
      return { invalidDomain: true };
    }
    return null;
  }

  onSubmit() {
    if (this.inviteForm.invalid) return;

    this.isLoading = true;
    this.message = null;
    const { email } = this.inviteForm.value;

    this.authService.inviteUser(email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.message = { text: `Usuario ${email} dado correctamente de alta.`, type: 'success' };
        this.inviteForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.message = {
          text: err.error?.error || 'Error al añadir usuario.',
          type: 'error'
        };
      }
    });
  }
}
