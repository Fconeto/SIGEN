using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class ResidenceCreateRequest
{
    public long? AgenteId { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public TipoDoImovel? TipoDoImovel { get; set; }
    public bool Demolida { get; set; }
    public int? Numero { get; set; }
    public string? Complemento { get; set; }
    public long? NumeroDoQuarteirao { get; set; }
    public string? ComplementoDoQuarteirao { get; set; }
    public string? NomeDoMorador { get; set; }
    public bool Inabitado { get; set; }
}
