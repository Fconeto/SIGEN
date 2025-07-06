using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class PITRegisterRequest
{
    public long? AgenteId { get; set; }
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
    public long PesquisaId { get; set; }
}