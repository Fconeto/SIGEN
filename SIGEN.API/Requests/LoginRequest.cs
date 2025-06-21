namespace SIGEN.API.Requests;

public class LoginRequest
{
    public required string CPF { get; set; }
    public required string Senha { get; set; }
}
