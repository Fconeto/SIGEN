using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class PITRegisterRequest
{
    public long? AgenteId { get; set; }
    public long NumeracaoDoPit { get; set; }
    public string Cres { get; set; }
    public string Municipio { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public int NumeroDaCasa { get; set; }
    public bool CapturaIntra { get; set; } = false;
    public bool CapturaPeri { get; set; } = false;
    public string LocalOndeEncontrou { get; set; }
    public required string NomeDoMorador { get; set; }
    public required string NomeDoCapturador { get; set; }
    public TipoDeInsetoEnum TipoDoInseto { get; set; }
    public string? OutroTipoDeInseto { get; set; }
    public required string NomeDoRecebedor { get; set; }
}