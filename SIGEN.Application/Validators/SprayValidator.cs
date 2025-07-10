using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Application.Validators;

public class SprayValidator
{
    public void Validate(ConsultFiltersRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("O código da localidade deve ser maior que zero.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");

        if (!Enum.IsDefined(typeof(Order), request.Order) || !Enum.IsDefined(typeof(OrderType), request.OrderType))
            throw new SigenValidationException("Tipo de ordenação inválido.");
    }
    
}