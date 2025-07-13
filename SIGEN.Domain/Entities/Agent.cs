using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities;

public class Agent : BaseEntity
{
    public long Id { get; set; }
    public string NomeDoAgente { get; set; } = string.Empty;
    public Turma Turma { get; set; }
    public string Senha { get; set; } = string.Empty;
    public long Matricula { get; set; }
    public string CPF { get; set; } = string.Empty;
    public Hierarquia Hierarquia { get; set; }
    public int Tentativas { get; set; } = 0;
    public DateTime UltimaTentativa { get; set; }
}
