export enum WallType {
  AlvenariaComReboco = 0,
  AlvenariaSemReboco = 1,
  BarroComReboco = 2,
  BarroSemReboco = 3,
  Madeira = 4,
  Outros = 5
}

export const WallTypeLabels: Record<WallType, string> = {
    [WallType.AlvenariaComReboco]: 'Alvenaria c/Reboco',
    [WallType.AlvenariaSemReboco]: 'Alvenaria s/Reboco',
    [WallType.BarroComReboco]: 'Barro c/Reboco',
    [WallType.BarroSemReboco]: 'Barro s/Reboco',
    [WallType.Madeira]: 'Madeira',
    [WallType.Outros]: 'Outros',
};