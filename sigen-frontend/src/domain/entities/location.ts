export enum LocationCategory {
  neighborhood = 0,
  city = 1,
  farm = 2,
  town = 3,
  site = 4,
  village = 5,
}

export const LocationCategoryLabels: Record<LocationCategory, string> = {
    [LocationCategory.neighborhood]: 'Bairro',
    [LocationCategory.city]: 'Cidade',
    [LocationCategory.farm]: 'Fazenda',
    [LocationCategory.town]: 'Povoado',
    [LocationCategory.site]: 'Sítio',
    [LocationCategory.village]: 'Vila',
};