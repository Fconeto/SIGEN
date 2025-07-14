export interface ResidenceInfos {
  id: string;
  complement: string;
  numeroCasa: string;
  nomeMorador: string;
  status: 'pending' | 'completed';
}

export type ResidenceSortKey = keyof Omit<ResidenceInfos, 'status'>;