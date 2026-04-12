import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { HeaderComponent } from '../../shared/header/header.component';
import { MaterialModule } from '../../core/material/material-module';
import { PdfService } from '../../core/services/pdf.service';
import { ReportsService } from '../../core/services/report.service';

import { TableDialogComponent } from './components/table-dialog/table-dialog.component';
import { GeneralStepComponent } from './components/general-step/general-step.component';
import { FunctionalStepComponent } from './components/functional-step/functional-step.component';
import { BiometricsStepComponent } from './components/biometrics-step/biometrics-step.component';
import { LabsStepComponent } from './components/labs-step/labs-step.component';
import { ConclusionStepComponent } from './components/conclusion-step/conclusion-step.component';

import { BARTHEL_QUESTIONS, BarthelQuestion } from './config/barthel.config';
import { buildFinalReport } from './utils/form-mappers';
import {
  calculateImc,
  calculateFrailScore,
  getFrailInterpretation,
  calculateBarthelScore,
  getBarthelInterpretation
} from './utils/form-calculations';
import {
  buildGeneralForm,
  buildFunctionalForm,
  buildBiometricsForm,
  buildAirwayForm,
  buildLabsForm,
  buildConclusionForm
} from './utils/form-builders';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    MaterialModule,
    MatDialogModule,
    GeneralStepComponent,
    FunctionalStepComponent,
    BiometricsStepComponent,
    LabsStepComponent,
    ConclusionStepComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private pdfService = inject(PdfService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private reportsService = inject(ReportsService);

  generalForm: FormGroup;
  functionalForm: FormGroup;
  biometricsForm: FormGroup;
  airwayForm: FormGroup;
  labsForm: FormGroup;
  conclusionForm: FormGroup;

  imcValue: number | null = null;
  frailScore = 0;
  frailInterpretation = '';
  barthelScore = 0;
  barthelInterpretation = '';

  readonly barthelQuestions: BarthelQuestion[] = BARTHEL_QUESTIONS;

  constructor() {
    this.generalForm = buildGeneralForm(this.fb);
    this.functionalForm = buildFunctionalForm(this.fb, this.barthelQuestions);
    this.biometricsForm = buildBiometricsForm(this.fb);
    this.airwayForm = buildAirwayForm(this.fb);
    this.labsForm = buildLabsForm(this.fb);
    this.conclusionForm = buildConclusionForm(this.fb);
  }

  ngOnInit(): void {
    this.setupImcCalculation();
    this.setupFunctionalCalculations();
  }

  get isDelayed(): boolean {
    return this.conclusionForm.get('decision')?.value === 'Demorado';
  }

  exitForm(): void {
    const confirmExit = confirm(
      '¿Seguro que quieres salir del formulario? Los cambios no guardados se pueden perder.'
    );

    if (confirmExit) {
      this.router.navigate(['/dashboard']);
    }
  }

  openRiskTable(): void {
    this.dialog.open(TableDialogComponent, {
      data: {
        title: 'Tabla de Riesgo Quirúrgico',
        imageSrc: 'assets/tabla_riesgo.png'
      },
      width: '90vw',
      maxWidth: '800px'
    });
  }

  openASATable(): void {
    this.dialog.open(TableDialogComponent, {
      data: {
        title: 'Clasificación ASA',
        imageSrc: 'assets/tabla_asa.png'
      },
      width: '90vw',
      maxWidth: '800px'
    });
  }

  async onSubmit(): Promise<void> {
    console.log('1. onSubmit llamado');

    const finalReport = buildFinalReport({
      generalFormValue: this.generalForm.value,
      functionalFormValue: this.functionalForm.value,
      biometricsFormValue: this.biometricsForm.value,
      airwayFormValue: this.airwayForm.value,
      labsFormValue: this.labsForm.value,
      conclusionFormValue: this.conclusionForm.value,
      imcValue: this.imcValue,
      frailInterpretation: this.frailInterpretation,
      barthelInterpretation: this.barthelInterpretation
    });


    const blob = await this.pdfService.generateReportBlob(finalReport);
    const file = new File([blob], 'test.pdf', { type: 'application/pdf' });
    const fileName = `Informe-CPPO-${new Date().toISOString().slice(0, 10)}.pdf`;

    this.reportsService.uploadReport(file, finalReport).subscribe({
      next: (res) => {
        console.log('Informe guardado correctamente', res);
        this.pdfService.downloadBlob(blob, fileName);
      },
      error: (err) => {
        console.error('Error guardando el informe', err);
      }
    });
  }

  private setupImcCalculation(): void {
    this.biometricsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(values => {
        this.imcValue = calculateImc(values.weight, values.height);
      });
  }

  private setupFunctionalCalculations(): void {
    this.functionalForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(values => {
        this.frailScore = calculateFrailScore({
          f_fatigue: values.f_fatigue,
          f_resistance: values.f_resistance,
          f_aerobic: values.f_aerobic,
          f_illness: values.f_illness,
          f_weight_loss: values.f_weight_loss
        });

        this.frailInterpretation = getFrailInterpretation(this.frailScore);
        this.barthelScore = calculateBarthelScore(values, this.barthelQuestions);
        this.barthelInterpretation = getBarthelInterpretation(this.barthelScore);
      });
  }
}
