using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Responses;
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
            var parameters = new DynamicParameters();
            parameters.Add("@TipoDoImovel", (int)residence.TipoDeImovel);
            parameters.Add("@NomeDoMorador", residence.NomeDoMorador);
            parameters.Add("@Numero", residence.Numero);
            parameters.Add("@CodigoDaLocalidade", residence.CodigoDaLocalidade);
            parameters.Add("@Complemento", residence.Complemento);
            parameters.Add("@NumeroDoQuarteirao", residence.NumeroDoQuarteirao);
            parameters.Add("@ComplementoDoQuarteirao", residence.ComplementoDoQuarteirao);
            parameters.Add("@Demolida", (int)residence.Demolida);
            parameters.Add("@Inabitado", (int)residence.Inabitado);
            parameters.Add("@DataDeRegistro", residence.DataDeRegistro);
            parameters.Add("@DataDeAtualizacao", residence.DataDeAtualizacao);
            parameters.Add("@CriadoPor", residence.CriadoPor);
            parameters.Add("@AtualizadoPor", residence.AtualizadoPor);

            await connection.ExecuteAsync(
                "InsertResidencia",
                parameters,
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
    
    public async Task<List<GetResidenceListResponse>> GetResidenceListByFilters(
        long codigoDaLocalidade,
        string? nomeDoMorador,
        int? numeroDaCasa,
        string? numeroDoComplemento,
        Order order,
        OrderType orderType,
        int page
    )
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", codigoDaLocalidade);
            parameters.Add("@NomeDoMorador", nomeDoMorador);
            parameters.Add("@NumeroDaCasa", numeroDaCasa);
            parameters.Add("@NumeroDoComplemento", numeroDoComplemento);
            parameters.Add("@Order", (int)order);
            parameters.Add("@OrderType", (int)orderType);
            parameters.Add("@Page", page);

            return await connection.QueryFirstOrDefaultAsync<List<GetResidenceListResponse>>(
                "GetResidenceListByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}