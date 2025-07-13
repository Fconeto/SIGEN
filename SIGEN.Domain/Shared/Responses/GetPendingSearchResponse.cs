namespace SIGEN.Domain.Shared.Responses;

public class GetPendingSearchResponse : BaseConsult
{
    public long Id { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public string? NomeDaLocalidade { get; set; }
    public string? CategoriaDaLocalidade { get; set; }
    public string? NomeDoMorador { get; set; }
    public int? Numero { get; set; }
    public string? Complemento { get; set; }
    public DateTime DataDeRegistro { get; set; }
    public DateTime DataDeAtualizacao { get; set; }
    public long CriadoPor { get; set; }
    public long AtualizadoPor { get; set; }
}
