using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Infrastructure.Interfaces;
namespace SIGEN.Infrastructure.Repository;

public class SearchRepository : ISearchRepository
{
    private readonly string _connectionString;
    public SearchRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<GetPendingSearchResponse>> GetPendingSearchListByFilters(
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
            parameters.Add("@Year", DateTime.Now.Year);

            var result = await connection.QueryAsync<GetPendingSearchResponse>(
                "GetPendingSearchListByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
    }

    public async Task<Residence> GetPendingSearchByResidenciaId(long residenciaId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ResidenciaId", residenciaId);
            parameters.Add("@Year", DateTime.Now.Year);

            var result = await connection.QueryFirstOrDefaultAsync<Residence>(
                "GetPendingSearchByResidenciaId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result;
        }
    }

    public async Task InsertSearch(Search search)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ResidenciaId", search.ResidenciaId);
            parameters.Add("@AgenteId", search.AgenteId);
            parameters.Add("@MatriculaDoAgente", search.MatriculaDoAgente);
            parameters.Add("@DataDaVisita", search.DataDaVisita);
            parameters.Add("@Pendencia", (int)search.Pendencia);
            parameters.Add("@NomeDoMorador", search.NomeDoMorador);
            parameters.Add("@NumeroDeHabitantes", search.NumeroDeHabitantes);
            parameters.Add("@TipoDeParede", (int)search.TipoDeParede);
            parameters.Add("@OutraParede", search.OutraParede);
            parameters.Add("@TipoDeTeto", (int)search.TipoDeTeto);
            parameters.Add("@OutroTeto", search.OutroTeto);
            parameters.Add("@CapturaIntra", search.CapturaIntra);
            parameters.Add("@CapturaPeri", search.CapturaPeri);
            parameters.Add("@AnexosPositivos", search.AnexosPositivos);
            parameters.Add("@AnexosNegativos", search.AnexosNegativos);
            parameters.Add("@NumeroDeGatos", search.NumeroDeGatos);
            parameters.Add("@NumeroDeCachorros", search.NumeroDeCachorros);

            await connection.ExecuteAsync(
                "InsertPesquisa",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
    

}