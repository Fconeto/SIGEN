using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Mappers;

public class SearchMapper
{
    public Search Map(CreateSearchRequest request)
    {
        return new Search
        {
            ResidenciaId = request.ResidenciaId,
            AgenteId = request.AgenteId,
            DataDaVisita = request.Data,
            Pendencia = request.Pendencia,
            NomeDoMorador = request.NomeDoMorador,
            NumeroDeHabitantes = request.NumeroDeHabitantes,
            TipoDeParede = request.TipoDeParede,
            OutraParede = request.OutrosTipoDeParede,
            TipoDeTeto = request.TipoDeTeto,
            OutroTeto = request.OutrosTipoDeTeto,
            CapturaIntra = request.CapturaIntra,
            CapturaPeri = request.CapturaPeri,
            AnexosPositivos = request.AnexosPositivos,
            AnexosNegativos = request.AnexosNegativos,
            NumeroDeGatos = request.NumGatos,
            NumeroDeCachorros = request.NumCachorros
        };
    }
}