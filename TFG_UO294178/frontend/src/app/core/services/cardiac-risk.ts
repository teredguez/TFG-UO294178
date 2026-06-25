export function calculateCardiacRisk(formData: any): string {

  const THETA_0 = -4.637985;

  const T_EDAD = 0.073403;
  const T_SEXO = 0.806730;
  const T_IMC = 0.029045;
  const T_HEMOGLOBINA = -0.094351;
  const T_DIABETES = 0.886055;

  const edad = Number(formData.age) || 0;
  const sexo = Number(formData.sex) || 0;
  const imc = Number(formData.bmi) || 0;
  const hemoglobina = Number(formData.hemoglobin) || 0;

  const diabetes =
    formData.diabetes === true ? 1 : 0;

  const z =
    THETA_0 +
    (T_EDAD * edad) +
    (T_SEXO * sexo) +
    (T_IMC * imc) +
    (T_HEMOGLOBINA * hemoglobina) +
    (T_DIABETES * diabetes);

  const probabilidad = 1 / (1 + Math.exp(-z));

  return (probabilidad * 100).toFixed(2) + '%';
}