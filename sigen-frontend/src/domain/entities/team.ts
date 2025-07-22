export enum AgentTeam {
    chagas = 0,
    febreAmarela = 1,
    dengue = 2,
    peste = 3,
}

export const AgentTeamLabels: Record<AgentTeam, string> = {
    [AgentTeam.chagas]: 'Chagas',
    [AgentTeam.febreAmarela]: 'Febre Amarela',
    [AgentTeam.dengue]: 'Dengue',
    [AgentTeam.peste]: 'Peste',
};