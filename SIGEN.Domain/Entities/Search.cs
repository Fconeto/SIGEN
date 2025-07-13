
using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities
{
    public class Search : BaseEntity
    {
        public long PesquisaId { get; set; }
        public long ResidenciaId { get; set; }
        public long AgenteId { get; set; }
        public int? MatriculaDoAgente { get; set; }
        public DateTime DataDaVisita { get; set; }
        public PendingSearchStatus Pendencia { get; set; }
        public string NomeDoMorador { get; set; } = string.Empty;
        public int NumeroDeHabitantes { get; set; }
        public WallType TipoDeParede { get; set; }
        public string? OutraParede { get; set; } = string.Empty;
        public CeilingType TipoDeTeto { get; set; }
        public string? OutroTeto { get; set; } = string.Empty;
        public bool CapturaIntra { get; set; }
        public bool CapturaPeri { get; set; }
        public int AnexosPositivos { get; set; }
        public int AnexosNegativos { get; set; }
        public int NumeroDeGatos { get; set; }
        public int NumeroDeCachorros { get; set; }
    }
}