using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Infrastructure.Repository;

public class PITRepository : IPITRepository
{
    private readonly string _connectionString;

    public PITRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task InsertPIT(PIT pit)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@AgenteId", pit.AgenteId);
            parameters.Add("@NumeracaoDoPit", pit.NumeracaoDoPit);
            parameters.Add("@Cres", pit.Cres);
            parameters.Add("@Municipio", pit.Municipio);
            parameters.Add("@CodigoDaLocalidade", pit.CodigoDaLocalidade);
            parameters.Add("@NumeroDaCasa", pit.NumeroDaCasa);
            parameters.Add("@CapturaIntra", pit.CapturaIntra);
            parameters.Add("@CapturaPeri", pit.CapturaPeri);
            parameters.Add("@LocalOndeEncontrou", pit.LocalOndeEncontrou);
            parameters.Add("@NomeDoMorador", pit.NomeDoMorador);
            parameters.Add("@NomeDoCapturador", pit.NomeDoCapturador);
            parameters.Add("@TipoDoInseto", (int)pit.TipoDoInseto);
            parameters.Add("@OutroTipoDeInseto", pit.OutroTipoDeInseto);
            parameters.Add("@NomeDoRecebedor", pit.NomeDoRecebedor);
            parameters.Add("@DataDeRegistro", pit.DataDeRegistro);
            parameters.Add("@DataDeAtualizacao", pit.DataDeAtualizacao);
            parameters.Add("@CriadoPor", pit.CriadoPor);
            parameters.Add("@AtualizadoPor", pit.AtualizadoPor);

            await connection.ExecuteAsync(
                "InsertPIT",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }

    public async Task<List<GetConsultPITListResponse>> GetPendingPITByFilters(ConsultFiltersRequest request)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", request.CodigoDaLocalidade);
            parameters.Add("@NomeDoMorador", request.NomeDoMorador);
            parameters.Add("@NumeroDaCasa", request.NumeroDaCasa);
            parameters.Add("@NumeroDoComplemento", request.NumeroDoComplemento);
            parameters.Add("@Order", (int)request.Order);
            parameters.Add("@OrderType", (int)request.OrderType);
            parameters.Add("@Page", request.Page);
            parameters.Add("@Year", DateTime.Now.Year);

            return (await connection.QueryAsync<GetConsultPITListResponse>(
                "GetPendingPITByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            )).ToList();
        }
    }

    public async Task<List<GetConsultPITListResponse>> GetPITByFilters(ConsultFiltersRequest request)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", request.CodigoDaLocalidade);
            parameters.Add("@NomeDoMorador", request.NomeDoMorador);
            parameters.Add("@NumeroDaCasa", request.NumeroDaCasa);
            parameters.Add("@NumeroDoComplemento", request.NumeroDoComplemento);
            parameters.Add("@Order", (int)request.Order);
            parameters.Add("@OrderType", (int)request.OrderType);
            parameters.Add("@Page", request.Page);
            parameters.Add("@Year", DateTime.Now.Year);

            return (await connection.QueryAsync<GetConsultPITListResponse>(
                "GetPITByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            )).ToList();
        }
    }
    public async Task InsertSearchPIT(SearchPIT searchPIT)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@PITId", searchPIT.PITId);
            parameters.Add("@Data", searchPIT.Data);
            parameters.Add("@Pendencia", (int)searchPIT.Pendencia);
            parameters.Add("@NomeDoMorador", searchPIT.NomeDoMorador);
            parameters.Add("@NumeroDeHabitantes", searchPIT.NumeroDeHabitantes);
            parameters.Add("@TipoDeParede", (int)searchPIT.TipoDeParede);
            parameters.Add("@TipoDeTeto", (int)searchPIT.TipoDeTeto);
            parameters.Add("@CapturaIntra", searchPIT.CapturaIntra);
            parameters.Add("@CapturaPeri", searchPIT.CapturaPeri);
            parameters.Add("@AnexosPositivos", searchPIT.AnexosPositivos);
            parameters.Add("@AnexosNegativos", searchPIT.AnexosNegativos);
            parameters.Add("@NumGatos", searchPIT.NumGatos);
            parameters.Add("@NumCachorros", searchPIT.NumCachorros);

            await connection.ExecuteAsync(
                "InsertSearchPIT",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
    public async Task UpdatePesquisaPITById(long pesquisaId, long? pitId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.ExecuteAsync("UpdatePesquisaPITById", new
            {
                PesquisaId = pesquisaId,
                PITId = pitId
            }, commandType: CommandType.StoredProcedure);
        }
    }
}
