using SIGEN.Domain.Enums;
namespace SIGEN.Domain.Shared;

public class RegisterRequest
{
    public string NomeDoAgente { get; set; }
    public Turma Turma { get; set; }
    public string Senha { get; set; }
    public long Matricula { get; set; }
    public string CPF { get; set; }
    public Hierarquia Hierarquia { get; set; }
}
