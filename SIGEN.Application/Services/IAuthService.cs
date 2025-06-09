using SIGEN.Domain.Shared;
using System.Threading.Tasks;

namespace SIGEN.Application.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
    }
}