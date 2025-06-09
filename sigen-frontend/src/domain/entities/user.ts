
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export enum UserRole {
    CHIEF_AGENT = 'chief_agent',
    AGENT = 'agent'
}