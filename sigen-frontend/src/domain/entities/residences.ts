export interface ResidenceInfos {
  id: string;
  complemento: string;
  numero: string;
  nomeDoMorador: string;
  status: 'pending' | 'completed';
}

export type ResidenceSortKey = keyof Omit<ResidenceInfos, 'status'>;