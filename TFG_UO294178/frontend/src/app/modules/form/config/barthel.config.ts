export interface BarthelOption {
  v: number;
  t: string;
}

export interface BarthelQuestion {
  label: string;
  control: string;
  opts: BarthelOption[];
}

export const BARTHEL_QUESTIONS: BarthelQuestion[] = [
  { label: 'Comida', control: 'b_comida', opts: [{ v: 10, t: 'Independiente' }, { v: 5, t: 'Necesita ayuda' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Aseo', control: 'b_aseo', opts: [{ v: 5, t: 'Independiente' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Vestido', control: 'b_vestido', opts: [{ v: 10, t: 'Independiente' }, { v: 5, t: 'Necesita ayuda' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Arreglo personal', control: 'b_arreglo', opts: [{ v: 5, t: 'Independiente' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Deposición', control: 'b_deposicion', opts: [{ v: 10, t: 'Continente' }, { v: 5, t: 'Accidente ocasional' }, { v: 0, t: 'Incontinente' }] },
  { label: 'Micción', control: 'b_miccion', opts: [{ v: 10, t: 'Continente' }, { v: 5, t: 'Accidente ocasional' }, { v: 0, t: 'Incontinente' }] },
  { label: 'Uso del retrete', control: 'b_retrete', opts: [{ v: 10, t: 'Independiente' }, { v: 5, t: 'Necesita ayuda' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Traslado sillón-cama', control: 'b_traslado', opts: [{ v: 15, t: 'Independiente' }, { v: 10, t: 'Mínima ayuda' }, { v: 5, t: 'Gran ayuda' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Deambulación', control: 'b_deambulacion', opts: [{ v: 15, t: 'Independiente' }, { v: 10, t: 'Necesita ayuda' }, { v: 5, t: 'Independiente en silla' }, { v: 0, t: 'Dependiente' }] },
  { label: 'Escaleras', control: 'b_escaleras', opts: [{ v: 10, t: 'Independiente' }, { v: 5, t: 'Necesita ayuda' }, { v: 0, t: 'Dependiente' }] }
];
