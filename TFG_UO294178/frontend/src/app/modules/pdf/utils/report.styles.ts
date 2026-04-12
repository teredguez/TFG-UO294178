import { reportTheme } from './report.theme';
import { reportMargins } from './report.margins';

export const reportStyles = {
  header: {
    fontSize: reportTheme.fontSizes.header,
    bold: true,
    color: reportTheme.colors.primary
  },

  sectionHeader: {
    fontSize: reportTheme.fontSizes.sectionHeader,
    bold: true,
    color: reportTheme.colors.heading,
    margin: reportMargins.sectionTitle
  },

  subHeader: {
    fontSize: reportTheme.fontSizes.subHeader,
    bold: true,
    color: reportTheme.colors.subHeading,
    fillColor: reportTheme.colors.subHeaderFill,
    margin: [0, 2, 0, 2]
  },

  bodyText: {
    fontSize: reportTheme.fontSizes.body,
    color: reportTheme.colors.text,
    margin: reportMargins.paragraph
  },

  th: {
    fontSize: reportTheme.fontSizes.th,
    bold: true,
    fillColor: reportTheme.colors.thFill,
    alignment: 'center'
  },

  decisionText: {
    fontSize: reportTheme.fontSizes.decision,
    bold: true,
    color: 'black'
  }
} as const;
