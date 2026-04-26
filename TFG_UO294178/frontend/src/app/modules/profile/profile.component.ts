import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MaterialModule } from '../../core/material/material-module';
import { AuthService } from '../../core/services/auth.service';
import { ReportsService } from '../../core/services/report.service';
import { AppUser } from '../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MaterialModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private reportsService = inject(ReportsService);
  private router = inject(Router);

  user: AppUser | null = null;
  summary: any = null;
  recentReports: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.authService.currentUserProfile$.subscribe(user => {
      this.user = user;
    });

    this.reportsService.getMyReports().subscribe({
      next: (res) => {
        const reports = res.reports || [];

        this.recentReports = reports.slice(0, 5);

        const decisionCounts = reports.reduce((acc: any, report: any) => {
          const decision = report.decision || 'Sin decisión';
          acc[decision] = (acc[decision] || 0) + 1;
          return acc;
        }, {});

        const mostFrequentDecision = Object.entries(decisionCounts)
          .sort((a: any, b: any) => b[1] - a[1])[0];

        this.summary = {
          total_reports: reports.length,
          most_frequent_decision: mostFrequentDecision ? mostFrequentDecision[0] : '—',
          most_frequent_decision_count: mostFrequentDecision ? mostFrequentDecision[1] : 0,
          last_report_date: reports.length > 0 ? reports[0].created_at : null
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.loading = false;
      }
    });
  }

  getInitial(): string {
    return this.user?.displayName?.charAt(0).toUpperCase() || 'U';
  }

  exit(): void {
    this.router.navigate(['/dashboard']);
  }
}
