using AutoMapper;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
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

        public async Task<string> LoginAsync(LoginRequest request)
        {
            try
            {
                AgentValidator validator = new AgentValidator();
                validator.Validate(request);

                Agent agente = await _authRepository.GetAgenteByCPF(request.CPF);

                if (agente == null)
                    throw new SigenValidationException("O login informado está incorreto.");

                if (agente.Tentativas >= 5 && agente.UltimaTentativa > DateTime.Now.AddMinutes(-10))
                    throw new SigenValidationException("O usuário está bloqueado por muitas tentativas de login, aguarde " + (int)(DateTime.Now - agente.UltimaTentativa).TotalMinutes + " minutos para tentar novamente.");

                string senhaHash = ComputeSha256Hash(request.Senha);
                if (agente.Senha != senhaHash)
                {
                    await _authRepository.UpdateAgenteTentativas(agente.Id, agente.Tentativas + 1);
                    throw new SigenValidationException("A senha informada está incorreta.");
                }

                await _authRepository.UpdateAgenteTentativas(agente.Id, 0);

                // Gerar JWT real
                var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "sua_chave_secreta_temporaria_1234567890";
                var issuer = "SIGEN";
                var audience = "SIGENUsers";
                string token = JwtTokenGenerator.GenerateToken(agente, secretKey, issuer, audience);

                return token;
            }
            catch (SigenValidationException ex)
            {
                throw new SigenValidationException(ex.Message);
            }
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

        public async Task RegisterAsync(RegisterRequest request)
        {
            try
            {
                AgentValidator validator = new AgentValidator();
                validator.Validate(request);

                request.Senha = ComputeSha256Hash(request.Senha);

                AuthMapper authMapper = new AuthMapper();
                Agent entity = authMapper.Mapper(request);

                await _authRepository.InsertAgente(entity);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    } 
}
