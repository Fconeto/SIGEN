export type ResidenceFilterType = "nomeMorador" | "bairro" | "numeroCasa";

export interface ResidenceFilterOption {
  value: ResidenceFilterType;
  label: string;
  fieldLabel: string;
}

export const residenceFilterOptions: ResidenceFilterOption[] = [
  { value: "nomeMorador", label: "Nome do morador", fieldLabel: "Nome do Morador" },
  { value: "bairro", label: "Bairro", fieldLabel: "Bairro" },
  { value: "numeroCasa", label: "Número da casa", fieldLabel: "Número da Casa" },
];

export interface ResidenceConsult {
  locationId: string;
  filterOption: ResidenceFilterType | "";
  nomeMorador?: string;
  bairro?: string;
  numeroCasa?: string;
}