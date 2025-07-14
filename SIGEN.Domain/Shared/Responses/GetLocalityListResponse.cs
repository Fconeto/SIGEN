namespace SIGEN.Domain.Shared.Responses;

public class GetLocalityListResponse
{
    public long LocalidadeId { get; set; }
    public long CodigoDaLocalidade { get; set; }
    public string? Nome { get; set; }
    public string? Categoria { get; set; }
    public DateTime DataDeRegistro { get; set; }
    public DateTime DataDeAtualizacao { get; set; }
    public long CriadoPor { get; set; }
    public long AtualizadoPor { get; set; }
}
