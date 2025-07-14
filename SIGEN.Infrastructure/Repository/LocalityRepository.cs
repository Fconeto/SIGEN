using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
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
}
