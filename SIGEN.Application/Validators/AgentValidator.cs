
using FluentValidation;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;

namespace SIGEN.Application.Validators;

public class AgentValidator
{
    public void Validate(RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.NomeDoAgente))
            throw new SigenValidationException("Nome é obrigatório.");

        if (request.Turma == null)
            throw new SigenValidationException("Turma é obrigatória.");

        if (string.IsNullOrEmpty(request.Senha))
            throw new SigenValidationException("Senha é obrigatória.");

        if (request.Matricula <= 0)
            throw new SigenValidationException("Matrícula deve ser um número positivo.");

        if (string.IsNullOrEmpty(request.CPF))
            throw new SigenValidationException("CPF é obrigatório.");
    }
    
    public void Validate(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CPF))
            throw new SigenValidationException("O campo CPF é obrigatório.");
                    
        if (string.IsNullOrWhiteSpace(request.Senha))
            throw new SigenValidationException("O campo Senha é obrigatório.");
    }
}