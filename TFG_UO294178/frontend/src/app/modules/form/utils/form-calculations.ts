import { BarthelQuestion } from '../config/barthel.config';

export function calculateImc(weight: number | null, heightCm: number | null): number | null {
  if (!weight || !heightCm || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  return +(weight / (heightM * heightM)).toFixed(1);
}

export function calculateFrailScore(values: {
  f_fatigue?: boolean;
  f_resistance?: boolean;
  f_aerobic?: boolean;
  f_illness?: boolean;
  f_weight_loss?: boolean;
}): number {
  return Object.values(values).filter(Boolean).length;
}

export function getFrailInterpretation(score: number): string {
  if (score === 0) {
    return 'Robusto';
  }

  if (score <= 2) {
    return 'Prefrágil';
  }

  return 'Frágil';
}

export function calculateBarthelScore(
  formValue: Record<string, number | null>,
  questions: BarthelQuestion[]
): number {
  return questions.reduce((total, question) => {
    const value = formValue[question.control];
    return total + (typeof value === 'number' ? value : 0);
  }, 0);
}

export function getBarthelInterpretation(score: number): string {
  if (score < 20) {
    return 'Dependencia total';
  }

  if (score < 40) {
    return 'Dependencia grave';
  }

  if (score < 60) {
    return 'Dependencia moderada';
  }

  if (score < 100) {
    return 'Dependencia leve';
  }

  return 'Independiente';
}
