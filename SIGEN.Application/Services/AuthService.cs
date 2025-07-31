using AutoMapper;
using Microsoft.Extensions.Configuration;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Infrastructure.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace SIGEN.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                AgentValidator validator = new AgentValidator();
                validator.Validate(request);

                request.CPF = request.CPF.Replace(".", "").Replace("-", "");

                Agent agente = await _authRepository.GetAgenteByCPF(request.CPF);

                if (agente == null)
                    throw new SigenValidationException("O login informado está incorreto.");

                if (agente.Tentativas >= 5 && agente.UltimaTentativa > DateTime.Now.AddMinutes(-10))
                    throw new SigenValidationException("O usuário está bloqueado por muitas tentativas de login, aguarde " + (int)(DateTime.Now - agente.UltimaTentativa).TotalMinutes + " minutos para tentar novamente.");

                string senhaHash = ComputeSha256Hash(request.Senha, agente.Salt);
                if (agente.Senha != senhaHash)
                {
                    await _authRepository.UpdateAgenteTentativas(agente.Id, agente.Tentativas + 1);
                    throw new SigenValidationException("A senha informada está incorreta.");
                }

                await _authRepository.UpdateAgenteTentativas(agente.Id, 0);

                var secretKey = _configuration["Jwt:Key"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];
                string token = JwtTokenGenerator.GenerateToken(agente, secretKey, issuer, audience);

                AuthMapper authMapper = new AuthMapper();
                LoginResponse loginResponse = authMapper.Mapper(agente, token);

                return loginResponse;
            }
            catch (SigenValidationException ex)
            {
                throw new SigenValidationException(ex.Message);
            }
        }

        private string ComputeSha256Hash(string rawData, string salt = "")
        {
            if (!string.IsNullOrEmpty(salt))
                rawData += salt;

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

                request.CPF = request.CPF.Replace(".", "").Replace("-", "");

                Agent agente = await _authRepository.GetAgenteByCPF(request.CPF);

                if (agente != null)
                    throw new SigenValidationException("Já existe um agente cadastrado com o CPF informado.");

                string salt = Guid.NewGuid().ToString("N");

                request.Senha = ComputeSha256Hash(request.Senha, salt);

                AuthMapper authMapper = new AuthMapper();
                Agent entity = authMapper.Mapper(request, salt);

                await _authRepository.InsertAgente(entity);
            }
            catch (SigenValidationException ex)
            {
                throw new SigenValidationException(ex.Message);
            }
        }
    } 
}
