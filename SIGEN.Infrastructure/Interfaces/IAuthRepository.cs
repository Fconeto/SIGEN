using System.Threading.Tasks;
using SIGEN.Domain.Entities;

namespace SIGEN.Infrastructure.Interfaces
{
    public interface IAuthRepository
    {
        Task<AgenteDto?> GetAgenteByCPF(string cpf);
        Task UpdateAgenteTentativas(long? agenteId, int? tentativas);
        Task InsertAgente(Agent request);
    }

    public class AgenteDto
    {
        public long AgenteId { get; set; }
        public required string Senha { get; set; }
        public int Tentativas { get; set; }
        public DateTime UltimaTentativa { get; set; }
    }
}
