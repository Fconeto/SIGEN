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
            Data = request.Data,
            Pendencia = request.Pendencia,
            NomeDoMorador = request.NomeDoMorador,
            NumeroDeHabitantes = request.NumeroDeHabitantes,
            TipoDeParede = request.TipoDeParede,
            TipoDeTeto = request.TipoDeTeto,
            CapturaIntra = request.CapturaIntra,
            CapturaPeri = request.CapturaPeri,
            AnexosPositivos = request.AnexosPositivos,
            AnexosNegativos = request.AnexosNegativos,
            NumGatos = request.NumGatos,
            NumCachorros = request.NumCachorros
        };
    }
}