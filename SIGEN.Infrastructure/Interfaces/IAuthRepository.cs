using System.Threading.Tasks;
using SIGEN.Domain.Entities;

namespace SIGEN.Infrastructure.Interfaces
{
    public interface IAuthRepository
    {
        Task<Agent> GetAgenteByCPF(string cpf);
        Task UpdateAgenteTentativas(long? agenteId, int? tentativas);
        Task InsertAgente(Agent request);
    }
}
