using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Application.Mappers;

public class SprayMapper
{
    public Spray Mapper(SprayRequest request, long agenteMatricula)
    {
        return new Spray
        {
            DataDoPreenchimento = request.DataDoPreenchimento.ToDateTime(new TimeOnly(0, 0)),
            MatriculaDoAgente = agenteMatricula,
            Pendencia = request.Pendencia,
            TipoDeInseticida = request.TipoDeInseticida,
            NumeroDeCarga = request.NumeroDeCarga,
            PesquisaId = request.PesquisaId,
            AgenteId = request.AgenteId,
            DataDeRegistro = DateTime.Now,
            DataDeAtualizacao = DateTime.Now,
            CriadoPor = request.AgenteId,
            AtualizadoPor = request.AgenteId
        };
    }
}