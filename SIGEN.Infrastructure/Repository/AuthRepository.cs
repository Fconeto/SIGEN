using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using SIGEN.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Infrastructure.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly string _connectionString;
        public AuthRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<Agent> GetAgenteByCPF(string cpf)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var result = await connection.QueryFirstOrDefaultAsync<Agent>(
                    "GetAgenteByCPF",
                    new { CPF = cpf },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }

        public async Task UpdateAgenteTentativas(long? agenteId, int? tentativas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.ExecuteAsync(
                    "UpdateAgenteTentativas",
                    new { AgenteId = agenteId, Tentativas = tentativas },
                    commandType: CommandType.StoredProcedure
                );
            }
        }
        public async Task InsertAgente(Agent agent)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@NomeDoAgente", agent.NomeDoAgente);
                parameters.Add("@Turma", (int)agent.Turma);
                parameters.Add("@Senha", agent.Senha);
                parameters.Add("@Salt", agent.Salt);
                parameters.Add("@Matricula", agent.Matricula);
                parameters.Add("@CPF", agent.CPF);
                parameters.Add("@Hierarquia", (int)agent.Hierarquia);
                parameters.Add("@Tentativas", agent.Tentativas);
                parameters.Add("@DataDeRegistro", agent.DataDeRegistro);
                parameters.Add("@DataDeAtualizacao", agent.DataDeAtualizacao);
                parameters.Add("@CriadoPor", agent.CriadoPor);
                parameters.Add("@AtualizadoPor", agent.AtualizadoPor);

                await connection.ExecuteAsync(
                    "InsertAgente",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }
    }
}
