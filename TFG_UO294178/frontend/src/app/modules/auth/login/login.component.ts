import { Component, inject } from '@angular/core';
import { AuthService} from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variable para mostrar errores en el HTML si el login falla
  errorMessage: string | null = null;

  // Definimos el formulario con validaciones
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // Llamamos al servicio (que a su vez llama al Backend Node.js)
    this.authService.login(email, password).subscribe({
      next: () => {
        // Si todo va bien, el servicio redirige al dashboard
        console.log('Login correcto');
      },
      error: (err) => {
        console.error('Error en login:', err);
        // Mostramos el mensaje de error que nos devuelve el backend (si existe)
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Error al conectar con el servidor.';
        }
      }
    });
  }
}
