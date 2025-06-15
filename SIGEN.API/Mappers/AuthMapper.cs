namespace SIGEN.API.Mappers;
using SIGEN.API.Requests;
using DomainRequest = SIGEN.Domain.Shared;
public static class AuthMapper
{
    public static DomainRequest.RegisterRequest RegisterMapper(RegisterRequest registerRequest)
    {
        return new DomainRequest.RegisterRequest
        {
            NomeDoAgente = registerRequest.NomeDoAgente,
            Turma = registerRequest.Turma,
            Senha = registerRequest.Senha,
            Matricula = registerRequest.Matricula,
            CPF = registerRequest.CPF,
            Hierarquia = registerRequest.Hierarquia
        };
    }

}