import { reportTheme } from './report.theme';

const GRID = reportTheme.colors.grid;
const W = reportTheme.lineWidths.grid;

export const gridLayout = {
  hLineColor: () => GRID,
  vLineColor: () => GRID,
  hLineWidth: () => W,
  vLineWidth: () => W,
  paddingLeft: () => 4,
  paddingRight: () => 4,
  paddingTop: () => 3,
  paddingBottom: () => 3
} as const;


export const stripedGridLayout = {
  ...gridLayout,
  fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? reportTheme.colors.zebra : null)
} as const;

export const horizontalOnlyLayout = {
  hLineColor: () => GRID,
  hLineWidth: () => W,
  vLineWidth: () => 0,
  paddingLeft: () => 4,
  paddingRight: () => 4,
  paddingTop: () => 3,
  paddingBottom: () => 3
} as const;

