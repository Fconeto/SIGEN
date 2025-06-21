using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using SIGEN.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;

namespace SIGEN.Infrastructure.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly string _connectionString;
        public AuthRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<AgenteDto?> GetAgenteByCPF(string cpf)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var result = await connection.QueryFirstOrDefaultAsync<AgenteDto>(
                    "GetAgenteByCPF",
                    new { CPF = cpf },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }

        public async Task UpdateAgenteTentativas(long? agenteId, int? tentativas, string? cpf)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                if (agenteId.HasValue && tentativas.HasValue)
                {
                    await connection.ExecuteAsync(
                        "UpdateAgenteTentativas",
                        new { AgenteId = agenteId, Tentativas = tentativas },
                        commandType: CommandType.StoredProcedure
                    );
                }
                else if (!string.IsNullOrEmpty(cpf))
                {
                    // Busca o agenteId pelo CPF e incrementa tentativas
                    var agente = await GetAgenteByCPF(cpf);
                    if (agente != null)
                    {
                        await connection.ExecuteAsync(
                            "UpdateAgenteTentativas",
                            new { AgenteId = agente.AgenteId, Tentativas = agente.Tentativas + 1 },
                            commandType: CommandType.StoredProcedure
                        );
                    }
                }
            }
        }
    }
}
