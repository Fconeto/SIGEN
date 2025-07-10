using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Mappers;

public class PITMapper
{
    public PIT Mapper(PITRegisterRequest request)
    {
        return new PIT
        {
            NumeracaoDoPit = request.NumeracaoDoPit,
            AgenteId = request.AgenteId,
            Cres = request.Cres,
            Municipio = request.Municipio,
            CodigoDaLocalidade = request.CodigoDaLocalidade,
            NumeroDaCasa = request.NumeroDaCasa,
            CapturaIntra = request.CapturaIntra,
            CapturaPeri = request.CapturaPeri,
            LocalOndeEncontrou = request.LocalOndeEncontrou,
            NomeDoMorador = request.NomeDoMorador,
            NomeDoCapturador = request.NomeDoCapturador,
            TipoDoInseto = request.TipoDoInseto,
            OutroTipoDeInseto = request.OutroTipoDeInseto,
            NomeDoRecebedor = request.NomeDoRecebedor,
            DataDeRegistro = DateTime.UtcNow,
            DataDeAtualizacao = DateTime.UtcNow,
            CriadoPor = request.AgenteId ?? default(long),
            AtualizadoPor = request.AgenteId ?? default(long),
        };
    }
}