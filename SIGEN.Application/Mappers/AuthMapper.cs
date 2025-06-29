using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Mappers;

public class AuthMapper
{
    public Agent Mapper(RegisterRequest request)
    {
        return new Agent
        {
            NomeDoAgente = request.NomeDoAgente,
            Turma = request.Turma,
            Senha = request.Senha,
            Matricula = request.Matricula,
            CPF = request.CPF,
            Hierarquia = request.Hierarquia,
            DataDeRegistro = DateTime.Now,
            DataDeAtualizacao = DateTime.Now,
            CriadoPor = request.AgenteId ?? default(long),
            AtualizadoPor = request.AgenteId ?? default(long),
        };
    }
}