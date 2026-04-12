import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/material/material-module';

@Component({
  selector: 'app-general-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './general-step.component.html',
  styleUrls: ['./general-step.component.css']
})
export class GeneralStepComponent {
  @Input({ required: true }) form!: FormGroup;
}
