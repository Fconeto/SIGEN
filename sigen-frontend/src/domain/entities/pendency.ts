export enum PendencyState {
  Nenhuma = 0,
  Recusa = 1,
  Fechado = 2
}

export const PendencyStateLabels: Record<PendencyState, string> = {
    [PendencyState.Nenhuma]: 'Nenhuma',
    [PendencyState.Recusa]: 'Recusa',
    [PendencyState.Fechado]: 'Fechado',
};