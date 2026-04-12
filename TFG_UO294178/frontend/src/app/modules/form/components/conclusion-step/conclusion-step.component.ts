import { CommonModule } from '@angular/common';
import { Component, Input,  Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/material/material-module';

@Component({
  selector: 'app-conclusion-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './conclusion-step.component.html',
  styleUrls: ['./conclusion-step.component.css']
})
export class ConclusionStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isDelayed = false;

  @Output() submitForm = new EventEmitter<void>();
}
