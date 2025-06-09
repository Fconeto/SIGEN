using SIGEN.Domain.Shared;
using System.Threading.Tasks;

namespace SIGEN.Application.Services
{
    public class AuthService : IAuthService
    {
        public Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            if (request.Email == "user@email.com" && request.Password == "123456")
            {
                return Task.FromResult(new AuthResponse
                {
                    IsSuccess = true,
                    Message = "Login successful!",
                    Token = "fake-jwt-token"
                });
            }
            return Task.FromResult(new AuthResponse
            {
                IsSuccess = false,
                Message = "Invalid credentials."
            });
        }

        public Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            return Task.FromResult(new AuthResponse
            {
                IsSuccess = true,
                Message = "User registered successfully!",
                Token = "fake-jwt-token"
            });
        }
    }
}
