using AutoMapper;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.Repositories;
using SIGEN.Domain.Shared;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
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
                    throw new Exception("O login informado está incorreto.");

                if (agente.Tentativas >= 5 && agente.UltimaTentativa > DateTime.Now.AddMinutes(-10))
                    throw new Exception("O usuário está bloqueado por muitas tentativas de login, aguarde " + (int)(DateTime.Now - agente.UltimaTentativa).TotalMinutes + " minutos para tentar novamente.");

                string senhaHash = ComputeSha256Hash(request.Senha);
                if (agente.Senha != senhaHash)
                {
                    await _authRepository.UpdateAgenteTentativas(agente.AgenteId, agente.Tentativas + 1);
                    throw new Exception("A senha informada está incorreta.");
                }

                await _authRepository.UpdateAgenteTentativas(agente.AgenteId, 0);
                string token = "jwt_token_fake";
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
        public async Task<AuthResponse> Execute(RegisterRequest request)
        {
            try
            {
                AgentValidator validator = new AgentValidator();
                validator.Validate(request);

                AuthMapper authMapper = new AuthMapper();
                var entity = authMapper.Mapper(request);

                await _authRepository.InsertAgente(entity);
            
                AuthResponse response = new AuthResponse
                {
                    IsSuccess = true,
                    Message = "Agente cadastrado com sucesso!",
                };

                return response;
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
    } 
}
