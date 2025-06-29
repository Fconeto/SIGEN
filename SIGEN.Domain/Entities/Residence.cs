using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;
public class Residence : BaseEntity
{
    public long Id { get; set; }
    public string CodigoDaLocalidade { get; set; } = string.Empty;
    public TipoDeImovel TipoDeImovel { get; set; }
    public SituacaoDoImovel SituacaoDoImovel { get; set; }
    public int Numero { get; set; }
    public string Complemento { get; set; } = string.Empty;
    public long NumeroDoQuarteirao { get; set; }
    public string ComplementoDoQuarteirao { get; set; } = string.Empty;
    public string? NomeDoMorador { get; set; } = string.Empty;
}
