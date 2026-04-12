import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private API_URL = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) { }

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
      withCredentials: true
    });


  }

  getMyReports() {
    return this.http.get<any>(this.API_URL, {
      withCredentials: true
    });
  }

  viewReport(reportId: number) {
    return this.http.get(`${this.API_URL}/${reportId}/view`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
