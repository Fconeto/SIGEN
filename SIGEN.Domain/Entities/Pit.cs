using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class PIT : BaseEntity
{
    public long Id { get; set; }
    public long? AgenteId { get; set; }
    public long NumeracaoDoPit { get; set; }
    public string Cres { get; set; }
    public string Municipio { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public int NumeroDaCasa { get; set; }
    public bool CapturaIntra { get; set; }
    public bool CapturaPeri { get; set; }
    public string? LocalOndeEncontrou { get; set; }
    public string? NomeDoMorador { get; set; }
    public string NomeDoCapturador { get; set; }
    public TipoDeInsetoEnum TipoDoInseto { get; set; }
    public string? OutroTipoDeInseto { get; set; }
    public string NomeDoRecebedor { get; set; }
    public long? PesquisaId { get; set; }
}