import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../core/material/material-module';

@Component({
  selector: 'app-table-dialog',
  standalone: true,
  imports: [MaterialModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <img
        [src]="data.imageSrc"
        [alt]="data.title"
        style="width: 100%; max-width: 800px; display: block; margin: 0 auto;"
      >
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class TableDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
