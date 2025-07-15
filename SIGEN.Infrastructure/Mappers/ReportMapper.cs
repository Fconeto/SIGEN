using SIGEN.Domain.Shared.Responses;
using System.Collections.Generic;

namespace SIGEN.Infrastructure.Mappers;

public static class ReportMapper
{
    public static List<ReportWeeklyItem> Map(IEnumerable<dynamic> itemsRaw)
    {
        var items = new List<ReportWeeklyItem>();
        foreach (var x in itemsRaw)
        {
            var item = new ReportWeeklyItem
            {
                CodigoDaLocalidade = x.CodigoDaLocalidade,
                Nome = x.Nome,
                Categoria = x.Categoria,
                Data = x.Data,
                Conclusao = x.Conclusao,
                LocalidadePositiva = x.LocalidadePositiva,
                NumeroHabitantes = x.NumeroHabitantes,
                CasasTrabalhadas = new CasasTrabalhadasInfo
                {
                    Positivas = x.CasasTrabalhadasPositivas,
                    Negativas = x.CasasTrabalhadasNegativas,
                    Total = x.CasasTrabalhadasTotal
                },
                CasasPendentes = new CasasPendentesInfo
                {
                    Fechadas = x.CasasPendentesFechadas,
                    Recusadas = x.CasasPendentesRecusadas,
                    Total = x.CasasPendentesTotal
                },
                AnexosTrabalhados = new AnexosTrabalhadosInfo
                {
                    Positivas = x.AnexosTrabalhadosPositivas,
                    Negativas = x.AnexosTrabalhadosNegativas,
                    Total = x.AnexosTrabalhadosTotal
                },
                UnidadesDomiciliares = new UnidadesDomiciliaresInfo
                {
                    Positivas = x.UnidadesDomiciliaresPositivas,
                    Negativas = x.UnidadesDomiciliaresNegativas,
                    Total = x.UnidadesDomiciliaresTotal
                },
                TriatomineosCapturados = new TriatomineosCapturadosInfo
                {
                    Intra = x.TriatomineosCapturadosIntra,
                    Peri = x.TriatomineosCapturadosPeri,
                    Total = x.TriatomineosCapturadosTotal
                },
                HomensTrabalhando = x.HomensTrabalhando,
                Caes = x.Caes,
                Gatos = x.Gatos
            };
            items.Add(item);
        }
        return items;
    }
}
