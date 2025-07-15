namespace SIGEN.Domain.Shared.Responses;

public class ReportWeeklyResponse
{
    public List<ReportWeeklyItem> Items { get; set; } = new();
}

public class ReportWeeklyItem
{
    public long CodigoDaLocalidade { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public bool Conclusao { get; set; }
    public bool LocalidadePositiva { get; set; }
    public int NumeroHabitantes { get; set; }
    public CasasTrabalhadasInfo CasasTrabalhadas { get; set; } = new();
    public CasasPendentesInfo CasasPendentes { get; set; } = new();
    public AnexosTrabalhadosInfo AnexosTrabalhados { get; set; } = new();
    public UnidadesDomiciliaresInfo UnidadesDomiciliares { get; set; } = new();
    public TriatomineosCapturadosInfo TriatomineosCapturados { get; set; } = new();
    public int HomensTrabalhando { get; set; }
    public int Caes { get; set; }
    public int Gatos { get; set; }
}

public class CasasTrabalhadasInfo
{
    public int Positivas { get; set; }
    public int Negativas { get; set; }
    public int Total { get; set; }
}

public class CasasPendentesInfo
{
    public int Fechadas { get; set; }
    public int Recusadas { get; set; }
    public int Total { get; set; }
}

public class AnexosTrabalhadosInfo
{
    public int Positivas { get; set; }
    public int Negativas { get; set; }
    public int Total { get; set; }
}

public class UnidadesDomiciliaresInfo
{
    public int Positivas { get; set; }
    public int Negativas { get; set; }
    public int Total { get; set; }
}

public class TriatomineosCapturadosInfo
{
    public int Intra { get; set; }
    public int Peri { get; set; }
    public int Total { get; set; }
}
