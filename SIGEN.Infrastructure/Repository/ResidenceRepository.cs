using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Infrastructure.Interfaces;
namespace SIGEN.Infrastructure.Repository;

public class ResidenceRepository : IResidenceRepository
{
    private readonly string _connectionString;
    public ResidenceRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task InsertResidence(Residence residence)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.ExecuteAsync(
                "InsertResidencia",
                new
                {
                    TipoDoImovel = (int)residence.TipoDeImovel,
                    residence.NomeDoMorador,
                    residence.Numero,
                    residence.CodigoDaLocalidade,
                    residence.Complemento,
                    residence.NumeroDoQuarteirao,
                    residence.ComplementoDoQuarteirao,
                    Demolida = (int)residence.Demolida,
                    Inabitado = (int)residence.Inabitado,
                    residence.DataDeRegistro,
                    residence.DataDeAtualizacao,
                    residence.CriadoPor,
                    residence.AtualizadoPor
                },
                commandType: CommandType.StoredProcedure
            );
        }
    }
    
    public async Task<Residence> GetResidenciaByLocalidadeAndNumeroAndComplemento(long codigoDaLocalidade, int? numero, string? complemento)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", codigoDaLocalidade);
            parameters.Add("@Numero", numero);
            parameters.Add("@Complemento", complemento);

            return await connection.QueryFirstOrDefaultAsync<Residence>(
                "GetResidenciaByLocalidadeAndNumeroAndComplemento",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}