using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Mappers;

public class SearchPITMapper
{
    public SearchPIT Map(SearchPITRequest request)
    {
        return new SearchPIT
        {
            AgenteId = request.AgenteId,
            PITId = request.PITId,
            ResidenciaId = request.ResidenciaId,
            Data = request.Data,
            Pendencia = request.Pendencia,
            NomeDoMorador = request.NomeDoMorador,
            NumeroDeHabitantes = request.NumeroDeHabitantes,
            TipoDeParede = request.TipoDeParede,
            OutroTipoDeParede = request.OutroTipoDeParede ?? string.Empty,
            TipoDeTeto = request.TipoDeTeto,
            OutroTipoDeTeto = request.OutroTipoDeTeto ?? string.Empty,
            CapturaIntra = request.CapturaIntra,
            CapturaPeri = request.CapturaPeri,
            AnexosPositivos = request.AnexosPositivos,
            AnexosNegativos = request.AnexosNegativos,
            NumGatos = request.NumGatos,
            NumCachorros = request.NumCachorros
        };
    }
}