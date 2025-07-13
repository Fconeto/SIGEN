using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Mappers;

public class ResidenceMapper
{
    public Residence Mapper(ResidenceCreateRequest request)
    {
        return new Residence
        {
            CodigoDaLocalidade = request.CodigoDaLocalidade,
            TipoDeImovel = request.TipoDoImovel,
            Demolida = request.Demolida ? Demolida.Sim : Demolida.Nao,
            Numero = request.Numero,
            Complemento = request.Complemento ?? string.Empty,
            NumeroDoQuarteirao = request.NumeroDoQuarteirao,
            ComplementoDoQuarteirao = request.ComplementoDoQuarteirao ?? string.Empty,
            NomeDoMorador = request.NomeDoMorador,
            Inabitado = request.Inabitado ? Inabitado.Sim : Inabitado.Nao,
            DataDeRegistro = DateTime.UtcNow,
            DataDeAtualizacao = DateTime.UtcNow,
            CriadoPor = request.AgenteId ?? default(long),
            AtualizadoPor = request.AgenteId ?? default(long)
        };
    }
}