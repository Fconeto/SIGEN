using FluentValidation;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Validators;
public class AgentValidator
{
    public void Validate(RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.NomeDoAgente))
            throw new ValidationException("Nome é obrigatório.");

        if (request.Turma == null)
            throw new ValidationException("Turma é obrigatória.");

        if (string.IsNullOrEmpty(request.Senha))
            throw new ValidationException("Senha é obrigatória.");

        if (request.Matricula <= 0)
            throw new ValidationException("Matrícula deve ser um número positivo.");
        
        if (string.IsNullOrEmpty(request.CPF))
            throw new ValidationException("CPF é obrigatório.");
    }
}