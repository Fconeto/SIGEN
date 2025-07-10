using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SIGEN.Domain.Entities;
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
}
