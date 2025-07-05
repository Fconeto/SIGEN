using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
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
}