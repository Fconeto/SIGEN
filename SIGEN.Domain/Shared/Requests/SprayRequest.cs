using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class SprayRequest
{
    public long AgenteId { get; set; }
    public DateOnly DataDoPreenchimento { get; set; }
    public Pendencia Pendencia { get; set; }
    public string? TipoDeInseticida { get; set; }
    public int? NumeroDeCarga { get; set; }
    public long PesquisaId { get; set; }
}