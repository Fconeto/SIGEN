using Microsoft.EntityFrameworkCore;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Repositories;

namespace SIGEN.Infrastructure.DataAccess.Repositories;

internal class AgentRepository : IAgentWriteOnlyRepository
{
    private readonly SIGENDbContext _Dbcontext;
    public AgentRepository(SIGENDbContext dbcontext)
    {
        _Dbcontext = dbcontext;
    }
    public async Task Add(Agent agent)
    {
        await _Dbcontext.Agents.AddAsync(agent);
    }
}