using SIGEN.Domain.Shared;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> Execute(RegisterRequest request);
    }
}