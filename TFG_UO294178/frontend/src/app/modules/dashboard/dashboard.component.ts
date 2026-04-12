import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Opciones del menú principal
  menuItems = [
    {
      title: 'Nueva Evaluación',
      subtitle: 'Iniciar valoración de paciente',
      icon: 'post_add',
      route: '/form',
      color: 'primary',
      description: 'Crear un nuevo informe de evaluación preoperatoria.'
    },
    {
      title: 'Historial de Informes',
      subtitle: 'Consultar evaluaciones previas',
      icon: 'history',
      route: '/history',
      color: 'accent',
      description: 'Buscar y revisar informes antiguos.'
    },
    {
      title: 'nueva funcionalidad',
      subtitle: '',
      icon: '',
      route: '',
      color: '',
      description: '.'
    }

  ];
}
