export enum CeilingType {
  Telha = 0,
  Palha = 1,
  Madeira = 2,
  Metalico = 3,
  Outros = 4
}

export const CeilingTypeLabels: Record<CeilingType, string> = {
  [CeilingType.Telha]: 'Telha',
  [CeilingType.Palha]: 'Palha',
  [CeilingType.Madeira]: 'Madeira',
  [CeilingType.Metalico]: 'Metálico',
  [CeilingType.Outros]: 'Outros'
};