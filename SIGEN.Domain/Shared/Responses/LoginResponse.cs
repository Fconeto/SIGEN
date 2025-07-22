using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Responses;

public class LoginResponse
{
    public long Id { get; set; }
    public string Nome { get; set; }
    public string Token { get; set; }
    public Hierarquia TipoDeUsuario { get; set; }
}