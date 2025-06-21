using System.Threading.Tasks;

namespace SIGEN.Infrastructure.Interfaces
{
    public interface IAuthRepository
    {
        Task<AgenteDto?> GetAgenteByCPF(string cpf);
        Task UpdateAgenteTentativas(long? agenteId, int? tentativas, string? cpf);
    }

    public class AgenteDto
    {
        public long AgenteId { get; set; }
        public required string Senha { get; set; }
        public int Tentativas { get; set; }
    }
}
