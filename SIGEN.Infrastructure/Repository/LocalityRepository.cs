using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Infrastructure.Repository;

public class LocalityRepository : ILocalityRepository
{
    private readonly string _connectionString;
    public LocalityRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<GetLocalityListResponse>> GetLocalityList()
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var result = await connection.QueryAsync<GetLocalityListResponse>(
                "GetLocalityList",
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
    }

    public async Task<Locality> GetLocalityByCode(long localityCode)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", localityCode);

            var result = await connection.QueryFirstOrDefaultAsync<Locality>(
                "GetLocalityByCode",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result;
        }
    }

    public async Task CreateLocality(Locality request)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", request.CodigoDaLocalidade);
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Categoria", request.Categoria);
            parameters.Add("@DataDeRegistro", request.DataDeRegistro);
            parameters.Add("@DataDeAtualização", request.DataDeAtualizacao);
            parameters.Add("@CriadoPor", request.CriadoPor);
            parameters.Add("@AtualizadoPor", request.AtualizadoPor);

            await connection.ExecuteAsync(
                "InsertLocalidade",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }

    public async Task<List<Locality>> GetLocalityListByFilters(ConsultLocalityListRequest request)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CodigoDaLocalidade", request.CodigoDaLocalidade);
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Categoria", request.Categoria);
            parameters.Add("@Order", (int)request.Order);
            parameters.Add("@OrderType", (int)request.OrderType);
            parameters.Add("@Page", request.Page);

            var result = await connection.QueryAsync<Locality>(
                "GetLocalityListByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
    }
}
