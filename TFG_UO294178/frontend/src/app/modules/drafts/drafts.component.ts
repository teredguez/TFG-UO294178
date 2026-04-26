import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ReportsService } from '../../core/services/report.service';
import { MaterialModule } from '../../core/material/material-module';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, MaterialModule, HeaderComponent,MatProgressSpinnerModule],
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})
export class DraftsComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);

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
      }
    });
  }

  continueDraft(draftId: number): void {
    this.router.navigate(['/form'], {
      queryParams: { draftId }
    });
  }

  deleteDraft(draftId: number): void {
  const confirmDelete = confirm('¿Seguro que quieres eliminar este borrador?');

  if (!confirmDelete) return;

  this.reportsService.deleteDraft(draftId).subscribe({
    next: () => {
      this.drafts = this.drafts.filter(draft => draft.id !== draftId);
    },
    error: (err) => {
      console.error('Error eliminando borrador:', err);
      alert('No se pudo eliminar el borrador');
    }
  });
}

  exit(): void {
    this.router.navigate(['/dashboard']);
  }
}
