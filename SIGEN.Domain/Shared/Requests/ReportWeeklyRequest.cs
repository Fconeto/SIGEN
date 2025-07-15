using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class ReportWeeklyRequest
{
    public string Microregional { get; set; } = string.Empty;
    public string Municipio { get; set; } = string.Empty;
    public FaseDeTrabalhoEnum FaseDeTrabalho { get; set; }
    public int Semana { get; set; }
    public Turma Turma { get; set; }
    public string GuardaChefe { get; set; } = string.Empty;
}
