using SIGEN.Domain.Entities;

namespace SIGEN.Domain.Repositories;

public interface IAgentWriteOnlyRepository
{
    Task InsertAgent(Agent request);
}

    
