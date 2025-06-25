using SIGEN.Domain.Entities;

namespace SIGEN.Domain.Repositories;

public interface IAgentWriteOnlyRepository
{
    Task Add(Agent request);
}

    
