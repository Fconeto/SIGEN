using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;
public class RegisterRequest
{
    public long? AgenteId { get; set; }
    public string NomeDoAgente { get; set; } = string.Empty;
    public Turma Turma { get; set; }
    public string Senha { get; set; } = string.Empty;
    public long Matricula { get; set; }
    public string CPF { get; set; } = string.Empty;
    public Hierarquia Hierarquia { get; set; }
}
