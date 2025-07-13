namespace SIGEN.Domain.Shared.Responses;

public class AuthResponse
{
    public string Message { get; set; }
    public bool IsSuccess { get; set; }
    public string? Token { get; set; }
}
