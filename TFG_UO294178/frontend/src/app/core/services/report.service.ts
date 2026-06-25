import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private API_URL = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) {}

  uploadReport(file: File, reportData: any) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('diagnosis', reportData.diagnosis ?? '');
    formData.append('surgery', reportData.surgery ?? '');
    formData.append('decision', reportData.decision ?? '');

    const normalizedListDate =
      reportData.listDate instanceof Date
        ? reportData.listDate.toISOString().slice(0, 10)
        : reportData.listDate || '';

    formData.append('listDate', normalizedListDate);

    formData.append('formData', JSON.stringify(reportData));

    return this.http.post(this.API_URL, formData, {
      withCredentials: true,
    });
  }

  getMyReports() {
    return this.http.get<any>(this.API_URL, {
      withCredentials: true,
    });
  }

  viewReport(reportId: number) {
    return this.http.get(`${this.API_URL}/${reportId}/view`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  deleteReport(reportId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${reportId}`, {
      withCredentials: true,
    });
  }

  getProfileActivity() {
    return this.http.get<any>(`${this.API_URL}/profile/activity`, {
      withCredentials: true,
    });
  }

  saveDraft(payload: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/drafts`, payload, {
      withCredentials: true,
    });
  }

  getDrafts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/drafts`, {
      withCredentials: true,
    });
  }

  getDraftById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/drafts/${id}`, {
      withCredentials: true,
    });
  }

  completeDraft(id: number, file: File, reportData: any): Observable<any> {
    const formData = new FormData();

    formData.append('pdf', file);
    formData.append('data', JSON.stringify(reportData));

    return this.http.put<any>(`${this.API_URL}/drafts/${id}/complete`, formData, {
      withCredentials: true,
    });
  }

  deleteDraft(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/drafts/${id}`, {
      withCredentials: true,
    });
  }
}
