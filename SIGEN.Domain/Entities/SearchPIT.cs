using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class SearchPIT
{
    public long Id { get; set; }
    public long? AgenteId { get; set; }
    public long? PITId { get; set; }
    public DateTime Data { get; set; }
    public PendingSearchStatus Pendencia { get; set; }
    public string NomeDoMorador { get; set; }
    public int NumeroDeHabitantes { get; set; }
    public WallType TipoDeParede { get; set; }
    public CeilingType TipoDeTeto { get; set; }
    public bool CapturaIntra { get; set; }
    public bool CapturaPeri { get; set; }
    public int AnexosPositivos { get; set; }
    public int AnexosNegativos { get; set; }
    public int NumGatos { get; set; }
    public int NumCachorros { get; set; }
}