using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class Spray : BaseEntity
{
    public long Id { get; set; }
    public long MatriculaDoAgente { get; set; }
    public long AgenteId { get; set; }
    public DateTime DataDoPreenchimento { get; set; }
    public Pendencia Pendencia { get; set; }
    public string? TipoDeInseticida { get; set; }
    public int? NumeroDeCarga { get; set; }
    public long PesquisaId { get; set; }
}