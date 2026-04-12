import { buildReport } from '../../modules/pdf/report.template';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private pdfMakeInstance: any;

  constructor() {
    this.pdfMakeInstance = (pdfMake as any).default
      ? (pdfMake as any).default
      : pdfMake;

    if ((pdfFonts as any).pdfMake?.vfs) {
      this.pdfMakeInstance.vfs = (pdfFonts as any).pdfMake.vfs;
    } else {
      this.pdfMakeInstance.vfs = (pdfFonts as any).vfs;
    }
  }

  generateReport(data: any): void {
    const docDefinition = buildReport(data);
    const fileName = `Informe_CPPO_${new Date().toISOString().slice(0, 10)}.pdf`;

    this.pdfMakeInstance.createPdf(docDefinition).download(fileName);
  }

  generateReportBlob(data: any): Promise<Blob> {
    const docDefinition = buildReport(data);

    return this.pdfMakeInstance
      .createPdf(docDefinition)
      .getBlob()
      .then((blob: Blob) => {
        return blob;
      });
  }

  downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
}
}
