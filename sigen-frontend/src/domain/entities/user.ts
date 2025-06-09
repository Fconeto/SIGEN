import { AgentTeam } from "./team";

export interface User {
    id: string;
    name: string;
    team: AgentTeam;
    role: UserRole;
}

export enum UserRole {
    CHIEF_AGENT = 'chief_agent',
    AGENT = 'agent'
}

export interface UserPermissions {
    [key: string]: UserRole[]
}

export const userPermissions: UserPermissions = {
    cadastroAgente: [UserRole.CHIEF_AGENT],
    relatorioSemanal: [UserRole.CHIEF_AGENT],
    cadastroResidencia: [UserRole.CHIEF_AGENT, UserRole.AGENT],
    pesquisa: [UserRole.CHIEF_AGENT, UserRole.AGENT],
    borrifacao: [UserRole.CHIEF_AGENT, UserRole.AGENT],
    consultaResidencia: [UserRole.CHIEF_AGENT, UserRole.AGENT],
    cadastroPit: [UserRole.CHIEF_AGENT, UserRole.AGENT],
    pesquisaPit: [UserRole.CHIEF_AGENT, UserRole.AGENT],
}
