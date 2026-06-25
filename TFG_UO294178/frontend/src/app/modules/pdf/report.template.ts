import { formatDate, valueOrDash } from './utils/report-helpers';
import { reportStyles } from './utils/report.styles';
import { reportMargins } from './utils/report.margins';
import { reportTheme } from './utils/report.theme';
import { gridLayout } from './utils/report.layouts';

export function buildReport(data: any): any {
  return {
    pageMargins: reportMargins.pageMargins,

    defaultStyle: {
      fontSize: reportTheme.fontSizes.body,
      color: reportTheme.colors.text,
    },

    styles: reportStyles,

    content: [
      // --- CABECERA ---
      {
        text: 'Informe Preoperatorio - Comité Perioperatorio',
        style: 'header',
        alignment: 'center',
        margin: reportMargins.header,
      },

      // 1. DIAGNÓSTICO
      { text: '1. Diagnóstico:', style: 'sectionHeader' },
      { text: data?.diagnosis || 'No especificado', style: 'bodyText' },

      // 2. CIRUGÍA, EDAD y SEXO
      { text: '2. Cirugía prevista:', style: 'sectionHeader' },
      { text: data?.surgery || 'No especificado', style: 'bodyText' },

      { text: '3. Datos del paciente:', style: 'sectionHeader' },
      {
        text: [
          { text: 'Edad: ', bold: true },
          data?.age ?? '--',
          { text: ' años   |   Sexo: ', bold: true },
          data?.sex === '1' ? 'Hombre' : data?.sex === '0' ? 'Mujer' : '--',
        ],
        style: 'bodyText',
      },

      // 3. FECHA Y PRIORIDAD
      { text: '3. Fecha inclusión en LE y Prioridad:', style: 'sectionHeader' },
      {
        text: [
          { text: 'Fecha: ', bold: true },
          formatDate(data?.listDate) || '--',
          { text: '  |  Prioridad: ', bold: true },
          data?.priority || '--',
        ],
        style: 'bodyText',
      },

      // 4. ANTECEDENTES
      { text: '4. Antecedentes personales:', style: 'sectionHeader' },
      { text: data?.history || 'Sin antecedentes relevantes.', style: 'bodyText' },

      // 5. TRATAMIENTOS
      { text: '5. Tratamientos domiciliarios:', style: 'sectionHeader' },
      { text: data?.medication || 'Sin tratamiento activo.', style: 'bodyText' },

      // 6. SITUACIÓN FUNCIONAL
      { text: '6. Situación basal funcional:', style: 'sectionHeader' },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            [{ text: 'Clasificación ASA', bold: true }, valueOrDash(data?.score_asa)],
            [{ text: 'Capacidad Funcional (METS)', bold: true }, valueOrDash(data?.score_mets)],
            [{ text: 'Escala FRAIL', bold: true }, valueOrDash(data?.score_frail)],
            [{ text: 'Escala BARTHEL', bold: true }, valueOrDash(data?.score_barthel)],
            [{ text: 'Riesgo Quirúrgico', bold: true }, valueOrDash(data?.surgical_risk)],
          ],
        },
        layout: gridLayout,
        margin: reportMargins.blockAfter,
      },

      // 7. CONSTANTES VITALES
      { text: '7. Constantes Vitales y Datos Antropométricos:', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Peso', style: 'th' },
              { text: 'Talla', style: 'th' },
              { text: 'IMC', style: 'th' },
              { text: 'TA', style: 'th' },
              { text: 'FC', style: 'th' },
              { text: 'Ritmo', style: 'th' },
            ],
            [
              data?.weight ? `${data.weight} kg` : '--',
              data?.height ? `${data.height} cm` : '--',
              valueOrDash(data?.bmi),
              data?.bp ? `${data.bp} mmHg` : '--',
              data?.hr ? `${data.hr} lpm` : '--',
              valueOrDash(data?.rhythm),
            ],
          ],
        },
        layout: gridLayout,
        margin: reportMargins.blockAfter,
      },

      // 8. VÍA AÉREA
      { text: '8. Exploración Vía Aérea:', style: 'sectionHeader' },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Dentadura a retirar: ', bold: true }, data?.dentures ? 'Sí' : 'No'],
          },
          {
            width: '*',
            text: [{ text: 'Mallampati: ', bold: true }, valueOrDash(data?.mallampati)],
          },
        ],
        columnGap: 10,
        margin: reportMargins.colsTight,
      },
      {
        columns: [
          {
            width: '*',
            text: [{ text: 'Dist. Tiromentoniana: ', bold: true }, valueOrDash(data?.thyromental)],
          },
          {
            width: '*',
            text: [{ text: 'Dist. Interincisivos: ', bold: true }, valueOrDash(data?.interincisor)],
          },
        ],
        columnGap: 10,
        margin: reportMargins.colsTight,
      },
      {
        text: [
          { text: 'Intubaciones previas: ', bold: true },
          valueOrDash(data?.previousIntubations),
        ],
        margin: reportMargins.blockAfter,
      },

      // 9. ANALÍTICA / EXPLORACIONES COMPLEMENTARIAS
      { text: '9. Exploraciones Complementarias:', style: 'sectionHeader' },

      { text: 'HEMATOLOGÍA', style: 'subHeader' },
      {
        table: {
          widths: ['35%', '15%', '35%', '15%'],
          body: [
            [
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
            ],
            [
              { text: 'Hemoglobina', bold: true },
              valueOrDash(data?.hemoglobin),
              { text: 'Plaquetas', bold: true },
              valueOrDash(data?.platelets),
            ],
            [
              { text: 'Coagulación', bold: true },
              valueOrDash(data?.coagulation),
              { text: 'GSAB', bold: true },
              valueOrDash(data?.gsab),
            ],
          ],
        },
        layout: gridLayout,
        margin: [0, 0, 0, 10],
      },

      { text: 'BIOQUÍMICA', style: 'subHeader' },
      {
        table: {
          widths: ['35%', '15%', '35%', '15%'],
          body: [
            [
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
            ],
            [
              { text: 'Glucemia', bold: true },
              valueOrDash(data?.glucose),
              { text: 'Función Renal', bold: true },
              valueOrDash(data?.renal),
            ],
            [
              { text: 'Función Hepática', bold: true },
              valueOrDash(data?.hepatic),
              { text: 'Iones', bold: true },
              valueOrDash(data?.ions),
            ],
            [
              { text: 'Sodio', bold: true },
              valueOrDash(data?.sodium),
              { text: 'Potasio', bold: true },
              valueOrDash(data?.potassium),
            ],
            [
              { text: 'Calcio', bold: true },
              valueOrDash(data?.calcium),
              { text: 'Fósforo', bold: true },
              valueOrDash(data?.phosphorus),
            ],
            [{ text: 'Magnesio', bold: true }, valueOrDash(data?.magnesium), '', ''],
          ],
        },
        layout: gridLayout,
        margin: [0, 0, 0, 10],
      },

      { text: 'MARCADORES CARDÍACOS', style: 'subHeader' },
      {
        table: {
          widths: ['35%', '15%', '35%', '15%'],
          body: [
            [
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
            ],
            [
              { text: 'Pro-BNP', bold: true },
              valueOrDash(data?.probnp),
              { text: 'Troponinas', bold: true },
              valueOrDash(data?.troponins),
            ],
            [{ text: 'Otros Marcadores', bold: true }, valueOrDash(data?.cardiac_markers), '', ''],
          ],
        },
        layout: gridLayout,
        margin: [0, 0, 0, 10],
      },

      { text: 'NUTRICIONAL / ANEMIA', style: 'subHeader' },
      {
        table: {
          widths: ['35%', '15%', '35%', '15%'],
          body: [
            [
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
              { text: 'Parámetro', style: 'th' },
              { text: 'Valor', style: 'th' },
            ],
            [
              { text: 'Prealbúmina', bold: true },
              valueOrDash(data?.prealbumin),
              { text: 'Hierro', bold: true },
              valueOrDash(data?.iron),
            ],
            [
              { text: 'Transferrina', bold: true },
              valueOrDash(data?.transferrin),
              { text: 'Ácido Fólico', bold: true },
              valueOrDash(data?.folic_acid),
            ],
            [
              { text: 'Estudio General', bold: true },
              valueOrDash(data?.nutritional_study),
              { text: 'Perfil Anemia', bold: true },
              valueOrDash(data?.anemia_profile),
            ],
          ],
        },
        layout: gridLayout,
        margin: reportMargins.blockAfter,
      },

      // OTRAS PRUEBAS
      { text: 'Otras Exploraciones:', style: 'sectionHeader', margin: [0, 0, 0, 6] },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            [{ text: 'EKG', bold: true }, valueOrDash(data?.ekg)],
            [{ text: 'Radiografía Tórax', bold: true }, valueOrDash(data?.xray)],
            [{ text: 'Ecocardiograma', bold: true }, valueOrDash(data?.echo)],
            [{ text: 'TAC', bold: true }, valueOrDash(data?.ct_scan)],
            [{ text: 'Espirometría', bold: true }, valueOrDash(data?.spirometry)],
            [{ text: 'Cateterismo', bold: true }, valueOrDash(data?.cath)],
            [{ text: 'Otros', bold: true }, data?.others || 'Sin hallazgos adicionales'],
          ],
        },
        layout: gridLayout,
        margin: reportMargins.blockAfter,
      },

      // 10. PROBLEMA
      { text: '10. Problema de manejo perioperatorio:', style: 'sectionHeader' },
      { text: data?.problem || 'No especificado.', style: 'bodyText' },

      // 11. PLAN
      { text: '11. Plan perioperatorio propuesto:', style: 'sectionHeader' },
      { text: data?.plan || 'Protocolo estándar.', style: 'bodyText' },

      // 12. DECISIÓN FINAL
      {
        text: [
          { text: '12. Decisión: ', style: 'sectionHeader' },
          { text: String(data?.decision || 'PENDIENTE').toUpperCase(), style: 'decisionText' },
        ],
        margin: reportMargins.decision,
      },
      data?.decision === 'Demorado'
        ? {
            text: `Motivo: ${data?.delayReason || '--'}`,
            margin: reportMargins.decisionReason,
            italics: true,
            color: reportTheme.colors.danger,
          }
        : {},

      //RIESGO

      {
        text: [
          { text: 'Riesgo cardiovascular estimado: ', bold: true },
          data?.cardiacRisk || 'No disponible',
        ],
        style: 'bodyText',
      },

      // FIRMA
      {
        text: '\n\nEL PACIENTE ENTIENDE, FIRMA y CONSIENTE..',
        alignment: 'center',
        italics: true,
        color: reportTheme.colors.muted,
        margin: reportMargins.signatureHeader,
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 200,
            text: `Fecha: ${new Date().toLocaleDateString()}\n\nDr/Dra: ${data.doctorName || ''}`,
            alignment: 'center',
            margin: reportMargins.signatureBox,
          },
        ],
      },
    ],
  };
}
