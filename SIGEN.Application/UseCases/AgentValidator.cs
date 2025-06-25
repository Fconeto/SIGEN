using SIGEN.Domain.Shared.Requests;
using FluentValidation;

namespace SIGEN.Application.UseCases;
    public class AgentValidator : AbstractValidator<RegisterRequest>
    {
        public AgentValidator()
        {
            RuleFor(x => x.NomeDoAgente).NotEmpty().WithMessage("Nome do Agente é obrigatório.");
            RuleFor(x => x.Turma).NotEmpty().WithMessage("Turma é obrigatória.");
            RuleFor(x => x.Senha).NotEmpty().WithMessage("Senha é obrigatória.");
            RuleFor(x => x.Matricula).NotEmpty().WithMessage("Matrícula é obrigatória.");
            RuleFor(x => x.CPF).NotEmpty().WithMessage("CPF é obrigatório.");
            RuleFor(x => x.Hierarquia).NotEmpty().WithMessage("Hierarquia é obrigatória.");
        }
    }