export interface BuildFinalReportParams {
  generalFormValue: Record<string, unknown>;
  functionalFormValue: Record<string, unknown>;
  biometricsFormValue: Record<string, unknown>;
  airwayFormValue: Record<string, unknown>;
  labsFormValue: Record<string, unknown>;
  conclusionFormValue: Record<string, unknown>;
  imcValue: number | null;
  frailInterpretation: string;
  barthelInterpretation: string;
}

export function buildFinalReport({
  generalFormValue,
  functionalFormValue,
  biometricsFormValue,
  airwayFormValue,
  labsFormValue,
  conclusionFormValue,
  imcValue,
  frailInterpretation,
  barthelInterpretation
}: BuildFinalReportParams) {
  return {
    ...generalFormValue,
    score_asa: functionalFormValue['asa'],
    score_mets: functionalFormValue['mets'],
    score_frail: frailInterpretation,
    score_barthel: barthelInterpretation,
    surgical_risk: functionalFormValue['surgicalRisk'],
    ...biometricsFormValue,
    bmi: imcValue,
    ...airwayFormValue,
    ...labsFormValue,
    ...conclusionFormValue
  };
}
