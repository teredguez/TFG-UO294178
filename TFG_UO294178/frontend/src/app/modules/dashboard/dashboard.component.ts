import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { ReportsService } from '../../core/services/report.service';

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
    MatGridListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private reportsService = inject(ReportsService);

  lastPrediction: string | null = null;
  draftsCount = 0;
  lastDraft: any = null;
  asaDistribution: any = null;

  ngOnInit(): void {
  this.reportsService.getProfileActivity().subscribe({
    next: (res) => {

      const lastReport = res.recentReports?.[0];

      if (lastReport?.form_data?.cardiacRisk) {
        this.lastPrediction = lastReport.form_data.cardiacRisk;
      }
      this.asaDistribution = res.asaDistribution;

    },
    error: (err) => {
      console.error(err);
    }
  });

  this.reportsService.getDrafts().subscribe({
  next: (drafts) => {

    this.draftsCount = drafts.length;

    if (drafts.length > 0) {
      this.lastDraft = drafts[0];
    }

  }
});
}

getAsaPercentage(value: number): number {
  if (!this.asaDistribution) return 0;

  const total =
    this.asaDistribution.I +
    this.asaDistribution.II +
    this.asaDistribution.III +
    this.asaDistribution.IV +
    this.asaDistribution.V;

  return total > 0 ? (value / total) * 100 : 0;
}

  // Opciones del menú principal
  menuItems = [
    {
      title: 'Nueva Evaluación',
      subtitle: 'Iniciar valoración de paciente',
      icon: 'post_add',
      route: '/form',
      color: 'primary',
      description: 'Crear un nuevo informe de evaluación preoperatoria.',
    },
    {
      title: 'Historial de Informes',
      subtitle: 'Consultar evaluaciones previas',
      icon: 'history',
      route: '/history',
      color: 'accent',
      description: 'Acceder al historial de informes preoperatorios.',
    },
    {
      title: 'Borradores',
      subtitle: 'Informes pendientes',
      icon: 'edit_note',
      route: '/drafts',
      color: 'primary',
      description: 'Continuar informes guardados como borrador.',
    },
  ];
}
