using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Infrastructure.Interfaces;
using System.Threading.Tasks;
using SIGEN.Infrastructure.Mappers;

namespace SIGEN.Infrastructure.Repository;

public class ReportRepository : IReportRepository
{
    private readonly string _connectionString;
    public ReportRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }


    public async Task<ReportWeeklyResponse> GetAVWeeklyReport(DateTime dataInicial, DateTime dataFinal, Turma turma)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DataInicial", dataInicial);
            parameters.Add("@DataFinal", dataFinal);
            parameters.Add("@Turma", (int)turma);

            var itemsRaw = await connection.QueryAsync<dynamic>(
                "GetAVWeeklyReport",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var items = ReportMapper.Map(itemsRaw);
            return new ReportWeeklyResponse { Items = items };
        }
    }

    public async Task<ReportWeeklyResponse> GetPITWeeklyReport(DateTime dataInicial, DateTime dataFinal, Turma turma)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DataInicial", dataInicial);
            parameters.Add("@DataFinal", dataFinal);
            parameters.Add("@Turma", (int)turma);

            var itemsRaw = await connection.QueryAsync<dynamic>(
                "GetPITWeeklyReport",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var items = ReportMapper.Map(itemsRaw);
            return new ReportWeeklyResponse { Items = items };
        }
    }
}
