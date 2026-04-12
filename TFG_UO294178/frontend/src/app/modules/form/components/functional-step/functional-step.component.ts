import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../core/material/material-module';
import { BarthelQuestion } from '../../config/barthel.config';

@Component({
  selector: 'app-functional-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './functional-step.component.html',
  styleUrls: ['./functional-step.component.css']
})
export class FunctionalStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) barthelQuestions!: BarthelQuestion[];
  @Input() frailScore = 0;
  @Input() frailInterpretation = '';
  @Input() barthelScore = 0;
  @Input() barthelInterpretation = '';

  @Output() openRiskTable = new EventEmitter<void>();
  @Output() openAsaTable = new EventEmitter<void>();
}
