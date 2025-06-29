namespace SIGEN.Domain.Shared.Responses;

public class Response
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public object? Data { get; set; }
}
