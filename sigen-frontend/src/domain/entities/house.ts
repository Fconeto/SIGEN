export interface House {
    id?: number,
    locationCode: string,
    category: string,
    propertyType: PropertyType,
    situation: PropertySituation,
    number: string,
    complement: string,
    quarterNumber: string,
    quarterComplement: string,
    residentName: string,
    uninhabited: false,
}


export enum PropertySituation {
    demolished = 0,
    new = 1,
}

export const PropertySituationLabels: Record<PropertySituation, string> = {
    [PropertySituation.demolished]: 'Demolido',
    [PropertySituation.new]: 'Novo',
};

export enum PropertyType {
    house = 0,
    market = 1,
    other = 2,
}

export const PropertyTypeLabels: Record<PropertyType, string> = {
    [PropertyType.house]: 'Residência',
    [PropertyType.market]: 'Comércio',
    [PropertyType.other]: 'Outro',
};