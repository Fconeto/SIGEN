using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class Residence : BaseEntity
{
    public long Id { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public TipoDoImovel? TipoDeImovel { get; set; }
    public Demolida Demolida { get; set; }
    public int? Numero { get; set; }
    public string? Complemento { get; set; }
    public long? NumeroDoQuarteirao { get; set; }
    public string? ComplementoDoQuarteirao { get; set; }
    public string? NomeDoMorador { get; set; } 
    public Inabitado Inabitado { get; set; }
}
