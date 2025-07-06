using SIGEN.Domain.Shared.Requests;
using FluentValidation;
using SIGEN.Domain.ExeptionsBase;

namespace SIGEN.Application.Validators;

public class SearchValidator
{
    public void Validate(ConsultFiltersRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");
    }
}