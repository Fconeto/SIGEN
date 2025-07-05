using SIGEN.Domain.Shared.Requests;
using FluentValidation;
using SIGEN.Domain.ExeptionsBase;

namespace SIGEN.Application.Validators;

public class ResidenceValidator
{
    public void Validate(ResidenceCreateRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.TipoDoImovel == null)
            throw new SigenValidationException("Tipo de imóvel é obrigatório.");

        if (string.IsNullOrEmpty(request.Complemento) && request.Numero == null)
            throw new SigenValidationException("O complemento e número não podem ser nulos.");
    }

    public void Validate(GetResidenceListRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");
    }
}