using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared;
using SIGEN.Infrastructure.Interfaces;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SIGEN.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        public AuthService(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.CPF))
                    throw new Exception("O campo CPF é obrigatório.");
                if (string.IsNullOrWhiteSpace(request.Senha))
                    throw new Exception("O campo Senha é obrigatório.");

                var agente = await _authRepository.GetAgenteByCPF(request.CPF);
                if (agente == null)
                {
                    // Atualiza tentativas se não encontrou
                    await _authRepository.UpdateAgenteTentativas(null, null, request.CPF);
                    throw new Exception("O login ou senha informados estão incorretos.");
                }

                // Comparação de senha com SHA-256
                string senhaHash = ComputeSha256Hash(request.Senha);
                if (agente.Senha != senhaHash)
                {
                    await _authRepository.UpdateAgenteTentativas(agente.AgenteId, agente.Tentativas + 1, null);
                    throw new Exception("O login ou senha informados estão incorretos.");
                }

                // Login correto, zera tentativas
                await _authRepository.UpdateAgenteTentativas(agente.AgenteId, 0, null);
                // Gerar JWT (implementação simplificada)
                string token = "jwt_token_fake"; // Substitua por geração real
                return new AuthResponse
                {
                    IsSuccess = true,
                    Message = "Login realizado com sucesso!",
                    Token = token
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse
                {
                    IsSuccess = false,
                    Message = "Erro ao processar a solicitação: " + ex.Message,
                };
            }
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

        private string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
