import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BarthelQuestion } from '../config/barthel.config';

function initBarthelControls(questions: BarthelQuestion[]): Record<string, [number | null]> {
  const controls: Record<string, [number | null]> = {};

  questions.forEach((question) => {
    controls[question.control] = [null];
  });

  return controls;
}

export function buildGeneralForm(fb: FormBuilder): FormGroup {
  return fb.group({
    diagnosis: ['', Validators.required],
    surgery: ['', Validators.required],

    age: ['', [Validators.required, Validators.min(10), Validators.max(120)]],
    sex: ['', Validators.required],

    listDate: [''],
    priority: [''],
    history: [''],
    ischemicHeartDisease: [false],
    heartFailure: [false],
    diabetes: [false],
    medication: [''],
  });
}

export function buildFunctionalForm(
  fb: FormBuilder,
  barthelQuestions: BarthelQuestion[],
): FormGroup {
  return fb.group({
    asa: ['', Validators.required],
    mets: [''],
    surgicalRisk: [''],

    f_fatigue: [false],
    f_resistance: [false],
    f_aerobic: [false],
    f_illness: [false],
    f_weight_loss: [false],

    b_wheelchair: [false],
    ...initBarthelControls(barthelQuestions),
  });
}

export function buildBiometricsForm(fb: FormBuilder): FormGroup {
  return fb.group({
    weight: [''],
    height: [''],
    bp: [''],
    hr: [''],
    rhythm: [''],
  });
}

export function buildAirwayForm(fb: FormBuilder): FormGroup {
  return fb.group({
    dentures: [false],
    mallampati: [''],
    thyromental: [''],
    interincisor: [''],
    previousIntubations: [''],
  });
}

export function buildLabsForm(fb: FormBuilder): FormGroup {
  return fb.group({
    hemoglobin: [''],
    platelets: [''],
    coagulation: [''],
    gsab: [''],

    glucose: [''],
    renal: [''],
    hepatic: [''],

    ions: [''],
    calcium: [''],
    phosphorus: [''],
    magnesium: [''],
    sodium: [''],
    potassium: [''],

    cardiac_markers: [''],
    probnp: [''],
    troponins: [''],

    nutritional_study: [''],
    prealbumin: [''],
    anemia_profile: [''],
    iron: [''],
    transferrin: [''],
    folic_acid: [''],

    ekg: [''],
    xray: [''],
    echo: [''],
    ct_scan: [''],
    spirometry: [''],
    cath: [''],
    others: [''],
  });
}

export function buildConclusionForm(fb: FormBuilder): FormGroup {
  return fb.group({
    problem: [''],
    plan: [''],
    decision: ['', Validators.required],
    delayReason: [''],
  });
}
