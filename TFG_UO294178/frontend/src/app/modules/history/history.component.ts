import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../core/services/report.service';
import { MaterialModule } from '../../core/material/material-module';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MaterialModule,HeaderComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private reportsService = inject(ReportsService);

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

}
