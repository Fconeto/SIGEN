using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class PIT : BaseEntity
{
    public long? PitId { get; set; }
    public long AgenteId { get; set; }
    public long NumeracaoDoPit { get; set; }
    public string Cres { get; set; }
    public string Municipio { get; set; }
    public string CodigoDaLocalidade { get; set; }
    public int NumeroDaCasa { get; set; }
    public OndeEncontrouEnum OndeEncontrou { get; set; }
    public string LocalOndeEntrou { get; set; }
    public string NomeDoMorador { get; set; }
    public string NomeDoCapturador { get; set; }
    public TipoDeInsetoEnum TipoDoInseto { get; set; }
    public string OutroTipoDeInseto { get; set; }
    public string NomeDoRecebedor { get; set; }
    public DateTime DataDoRegistro { get; set; }
    public DateTime DataDeAtualizacao { get; set; }
    public long PesquisaId { get; set; }
    public long CriadoPor { get; set; }
    public long AtualizadoPor { get; set; }
}