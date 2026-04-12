import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/material/material-module';

@Component({
  selector: 'app-labs-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './labs-step.component.html',
  styleUrls: ['./labs-step.component.css']
})
export class LabsStepComponent {
  @Input({ required: true }) form!: FormGroup;
}
