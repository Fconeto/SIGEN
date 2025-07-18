using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SIGEN.Domain.Entities;

namespace SIGEN.Application.Services
{
    public static class JwtTokenGenerator
    {
        public static string GenerateToken(Agent agent, string secretKey, string issuer, string audience)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("NomeDoAgente", agent.NomeDoAgente),
                    new Claim("Matricula", agent.Matricula.ToString()),
                    new Claim("Hierarquia", ((int)agent.Hierarquia).ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(10),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
