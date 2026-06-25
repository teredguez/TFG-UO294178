import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ReportsService } from '../../core/services/report.service';
import { MaterialModule } from '../../core/material/material-module';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, MaterialModule, HeaderComponent, MatProgressSpinnerModule],
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css'],
})
export class DraftsComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  drafts: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDrafts();
  }

  loadDrafts(): void {
    this.reportsService.getDrafts().subscribe({
      next: (drafts) => {
        this.drafts = drafts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando borradores', err);
        this.loading = false;
      },
    });
  }

  continueDraft(draftId: number): void {
    this.router.navigate(['/form'], {
      queryParams: { draftId },
    });
  }

  deleteDraft(id: number): void {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Eliminar borrador',
      message: '¿Desea eliminar este borrador? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      showCancel: true
    }
  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {
      return;
    }

    this.reportsService.deleteDraft(id).subscribe({
      next: () => {
        this.drafts = this.drafts.filter(d => d.id !== id);
      },
      error: (err) => {
        console.error('Error eliminando borrador', err);
      }
    });

  });
}

  exit(): void {
    this.router.navigate(['/dashboard']);
  }
}
