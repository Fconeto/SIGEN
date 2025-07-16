using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Infrastructure.Repository;

public class SprayRepository : ISprayRepository
{
    private readonly string _connectionString;

    public SprayRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }


    public async Task InsertBorrifacao(Spray spray)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var parameters = new DynamicParameters();
            parameters.Add("@MatriculaDoAgente", spray.MatriculaDoAgente);
            parameters.Add("@AgenteId", spray.AgenteId);
            parameters.Add("@DataDoPreenchimento", spray.DataDoPreenchimento);
            parameters.Add("@Pendencia", (int)spray.Pendencia);
            parameters.Add("@TipoDeInseticida", spray.TipoDeInseticida);
            parameters.Add("@NumeroDeCarga", spray.NumeroDeCarga);
            parameters.Add("@PesquisaId", spray.PesquisaId);
            parameters.Add("@DataDeRegistro", spray.DataDeRegistro);
            parameters.Add("@DataDeAtualizacao", spray.DataDeAtualizacao);
            parameters.Add("@CriadoPor", spray.CriadoPor);
            parameters.Add("@AtualizadoPor", spray.AtualizadoPor);

            await connection.ExecuteAsync("InsertBorrifacao", parameters, commandType: CommandType.StoredProcedure);
        }
    }
    public async Task<long?> GetSearchWithPendingSprayById(long pesquisaId)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            return await connection.QueryFirstOrDefaultAsync<long?>(
                "GetSearchWithPendingSprayById",
                new { PesquisaId = pesquisaId },
                commandType: CommandType.StoredProcedure
            );
        }

    }
    //  public async Task<Search> GetSearchByIdAsync(long searchId)
    // {
    //     using (var connection = new SqlConnection(_connectionString))
    //     {
    //         return await connection.QueryFirstOrDefaultAsync<Search>(
    //          new {  },
    //         commandType: CommandType.StoredProcedure);
    
    //     }
    // }
}