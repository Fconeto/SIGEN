using SIGEN.Domain.Shared.Requests;
using FluentValidation;

namespace SIGEN.Application.UseCases;
    public class ResidenceValidator : AbstractValidator<ResidenceCreateRequest>
    {
        public ResidenceValidator()
        {
            RuleFor(x => x.CodigoDaLocalidade).NotEmpty().WithMessage("Código da Localidade é obrigatório.");
            RuleFor(x => x.TipoDeImovel).IsInEnum().WithMessage("Tipo de Imóvel é inválido.");
            RuleFor(x => x.SituacaoDoImovel).IsInEnum().WithMessage("Situação do Imóvel é inválida.");
            RuleFor(x => x.Numero).GreaterThan(0).WithMessage("Número é obrigatório e deve ser maior que zero.");
            RuleFor(x => x.Complemento).NotEmpty().WithMessage("Complemento é obrigatório.");
            RuleFor(x => x.NumeroDoQuarteirao).GreaterThan(0).WithMessage("Número do Quarteirão é obrigatório e deve ser maior que zero");
            RuleFor(x => x.ComplementoDoQuarteirao).NotEmpty().WithMessage("Complemento do Quarteirão é obrigatório.");
            RuleFor(x => x.NomeDoMorador).NotEmpty().WithMessage("Nome do Morador é obrigatório.");
        }
    }