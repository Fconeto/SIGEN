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

public class SprayRepository : ISprayRepository
{
    private readonly string _connectionString;
    public SprayRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<GetPendingSprayResponse>> GetPendingSprayListByFilters(
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

            var result = await connection.QueryAsync<GetPendingSprayResponse>(
                "GetPendingSprayListByFilters",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
    }
}