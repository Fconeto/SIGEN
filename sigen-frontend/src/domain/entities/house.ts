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
    demolished = "Demolido",
    new = "Novo"
}

export enum PropertyType {
    house = "Residência",
    market = "Comércio",
    other = "Outro"
}