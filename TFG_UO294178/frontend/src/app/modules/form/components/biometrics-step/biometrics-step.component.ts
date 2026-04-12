import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/material/material-module';

@Component({
  selector: 'app-biometrics-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './biometrics-step.component.html',
  styleUrls: ['./biometrics-step.component.css']
})
export class BiometricsStepComponent {
  @Input({ required: true }) biometricsForm!: FormGroup;
  @Input({ required: true }) airwayForm!: FormGroup;
  @Input() imcValue: number | null = null;
}
