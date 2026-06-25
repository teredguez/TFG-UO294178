import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../core/services/report.service';
import { MaterialModule } from '../../core/material/material-module';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MaterialModule,HeaderComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  reports: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.reportsService.getMyReports().subscribe({
      next: (res) => {
        this.reports = res.reports;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando informes', err);
        this.loading = false;
      }
    });
  }

 viewReport(reportId: number): void {
  this.reportsService.viewReport(reportId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => {
      console.error('Error visualizando PDF', err);
    }
  });
}

deleteReport(id: number): void {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Eliminar informe',
      message: '¿Desea eliminar este informe? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      showCancel: true
    }
  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {
      return;
    }

    this.reportsService.deleteReport(id).subscribe({
      next: () => {

        this.reports = this.reports.filter(
          report => report.id !== id
        );

      },
      error: (err) => {
        console.error('Error eliminando informe', err);
      }
    });

  });
}

exit(): void {
    this.router.navigate(['/dashboard']);
  }

}
