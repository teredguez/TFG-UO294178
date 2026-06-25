import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { HeaderComponent } from '../../shared/header/header.component';
import { MaterialModule } from '../../core/material/material-module';
import { PdfService } from '../../core/services/pdf.service';
import { ReportsService } from '../../core/services/report.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

import { TableDialogComponent } from './components/table-dialog/table-dialog.component';
import { GeneralStepComponent } from './components/general-step/general-step.component';
import { FunctionalStepComponent } from './components/functional-step/functional-step.component';
import { BiometricsStepComponent } from './components/biometrics-step/biometrics-step.component';
import { LabsStepComponent } from './components/labs-step/labs-step.component';
import { ConclusionStepComponent } from './components/conclusion-step/conclusion-step.component';

import { BARTHEL_QUESTIONS, BarthelQuestion } from './config/barthel.config';
import { buildFinalReport } from './utils/form-mappers';
import { AuthService } from '../../core/services/auth.service';
import { calculateCardiacRisk } from '../../core/services/cardiac-risk';

import {
  calculateImc,
  calculateFrailScore,
  getFrailInterpretation,
  calculateBarthelScore,
  getBarthelInterpretation,
} from './utils/form-calculations';
import {
  buildGeneralForm,
  buildFunctionalForm,
  buildBiometricsForm,
  buildAirwayForm,
  buildLabsForm,
  buildConclusionForm,
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
    ConclusionStepComponent,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private pdfService = inject(PdfService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private reportsService = inject(ReportsService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

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
  draftId: number | null = null;
  currentUserName = '';

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
    const draftId = this.route.snapshot.queryParamMap.get('draftId');

    if (draftId) {
      this.loadDraft(Number(draftId));
    }

    this.authService.currentUserProfile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUserName = user?.displayName || '';
      });
  }

  get isDelayed(): boolean {
    return this.conclusionForm.get('decision')?.value === 'Demorado';
  }

  exitForm(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '420px',
        data: {
          title: 'Salir del formulario',
          message: '¿Seguro que quieres salir? Los cambios no guardados se perderán.',
          confirmText: 'Salir',
          cancelText: 'Cancelar',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.router.navigate(['/dashboard']);
      });
  }

  openRiskTable(): void {
    this.dialog.open(TableDialogComponent, {
      data: {
        title: 'Tabla de Riesgo Quirúrgico',
        imageSrc: 'assets/tabla_riesgo.png',
      },
      width: '90vw',
      maxWidth: '800px',
    });
  }

  openASATable(): void {
    this.dialog.open(TableDialogComponent, {
      data: {
        title: 'Clasificación ASA',
        imageSrc: 'assets/tabla_asa.png',
      },
      width: '90vw',
      maxWidth: '800px',
    });
  }

  async onSubmit(): Promise<void> {
    if (this.generalForm.invalid || this.conclusionForm.invalid) {
      this.generalForm.markAllAsTouched();
      this.conclusionForm.markAllAsTouched();

      this.dialog.open(ConfirmDialogComponent, {
        width: '420px',
        data: {
          title: 'Campos obligatorios incompletos',
          message:
            'Existen campos obligatorios sin completar. Revise el formulario antes de generar el informe.',
          confirmText: 'Aceptar',
          showCancel: false,
        },
      });

      return;
    }

    const finalReport = buildFinalReport({
      generalFormValue: this.generalForm.value,
      functionalFormValue: this.functionalForm.value,
      biometricsFormValue: this.biometricsForm.value,
      airwayFormValue: this.airwayForm.value,
      labsFormValue: this.labsForm.value,
      conclusionFormValue: this.conclusionForm.value,
      imcValue: this.imcValue,
      frailInterpretation: this.frailInterpretation,
      barthelInterpretation: this.barthelInterpretation,
    });

    (finalReport as any).doctorName = this.currentUserName;
    (finalReport as any).cardiacRisk = calculateCardiacRisk(finalReport);

    const blob = await this.pdfService.generateReportBlob(finalReport);
    const file = new File([blob], 'test.pdf', { type: 'application/pdf' });
    const fileName = `Informe-CPPO-${new Date().toISOString().slice(0, 10)}.pdf`;

    const request$ = this.draftId
      ? this.reportsService.completeDraft(this.draftId, file, finalReport)
      : this.reportsService.uploadReport(file, finalReport);

    request$.subscribe({
      next: (res) => {
        console.log('Informe guardado correctamente', res);
        this.pdfService.downloadBlob(blob, fileName);
        this.draftId = null;
      },
      error: (err) => {
        console.error('Error guardando el informe', err);
        alert('No se pudo guardar el informe');
      },
    });
  }

  private setupImcCalculation(): void {
    this.biometricsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        this.imcValue = calculateImc(values.weight, values.height);
      });
  }

  private setupFunctionalCalculations(): void {
    this.functionalForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        this.frailScore = calculateFrailScore({
          f_fatigue: values.f_fatigue,
          f_resistance: values.f_resistance,
          f_aerobic: values.f_aerobic,
          f_illness: values.f_illness,
          f_weight_loss: values.f_weight_loss,
        });

        this.frailInterpretation = getFrailInterpretation(this.frailScore);
        this.barthelScore = calculateBarthelScore(values, this.barthelQuestions);
        this.barthelInterpretation = getBarthelInterpretation(this.barthelScore);
      });
  }

  saveDraft(): void {
    const formData = {
      general: this.generalForm.getRawValue(),
      functional: this.functionalForm.getRawValue(),
      biometrics: this.biometricsForm.getRawValue(),
      airway: this.airwayForm.getRawValue(),
      labs: this.labsForm.getRawValue(),
      conclusion: this.conclusionForm.getRawValue(),
      calculatedValues: {
        imcValue: this.imcValue,
        frailScore: this.frailScore,
        frailInterpretation: this.frailInterpretation,
        barthelScore: this.barthelScore,
        barthelInterpretation: this.barthelInterpretation,
      },
    };

    const payload = {
      draftId: this.draftId,
      patientCode: formData.general.patientCode,
      diagnosis: formData.general.diagnosis,
      surgery: formData.general.surgery,
      decision: formData.conclusion.decision,
      listDate: formData.general.listDate,
      formData,
    };

    this.reportsService.saveDraft(payload).subscribe({
      next: (response) => {
        this.draftId = response.draft.id;
        this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data: {
            title: 'Borrador guardado',
            message: 'El borrador se ha guardado correctamente.',
            confirmText: 'Aceptar',
            showCancel: false,
          },
        });
      },
      error: (error) => {
        console.error('Error al guardar borrador:', error);
        this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data: {
            title: 'Error',
            message: 'No se pudo guardar el borrador.',
            confirmText: 'Aceptar',
            showCancel: false,
          },
        });
      },
    });
  }

  loadDraft(draftId: number): void {
    this.reportsService.getDraftById(draftId).subscribe({
      next: (draft) => {
        this.draftId = draft.id;

        const data = draft.form_data;

        if (!data) return;

        this.generalForm.patchValue(data.general || {});
        this.functionalForm.patchValue(data.functional || {});
        this.biometricsForm.patchValue(data.biometrics || {});
        this.airwayForm.patchValue(data.airway || {});
        this.labsForm.patchValue(data.labs || {});
        this.conclusionForm.patchValue(data.conclusion || {});

        if (data.calculatedValues) {
          this.imcValue = data.calculatedValues.imcValue ?? null;
          this.frailScore = data.calculatedValues.frailScore ?? 0;
          this.frailInterpretation = data.calculatedValues.frailInterpretation ?? '';
          this.barthelScore = data.calculatedValues.barthelScore ?? 0;
          this.barthelInterpretation = data.calculatedValues.barthelInterpretation ?? '';
        }
      },
      error: (err) => {
        console.error('Error cargando borrador:', err);
      },
    });
  }
}
