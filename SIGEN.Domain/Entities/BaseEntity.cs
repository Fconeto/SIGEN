namespace SIGEN.Domain.Entities;

public class BaseEntity
{
    public DateTime? DataDeRegistro { get; set; }
    public DateTime? DataDeAtualizacao { get; set; }
    public long? CriadoPor { get; set; }
    public long? AtualizadoPor { get; set; }
}
