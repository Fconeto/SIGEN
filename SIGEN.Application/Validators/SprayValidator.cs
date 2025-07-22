using Microsoft.IdentityModel.Tokens;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;

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

    public void Validate(SprayRequest request)
    {
        if (request.DataDoPreenchimento == default)
            throw new SigenValidationException("A Data do Preenchimento é obrigatória.");

        if (request.TipoDeInseticida.IsNullOrEmpty())
            throw new SigenValidationException("O Tipo de Inseticida é obrigatório.");

        if (request.NumeroDeCarga <= 0)
            throw new SigenValidationException("O Número de Carga deve ser um número positivo.");

        if (!Enum.IsDefined(typeof(Pendencia), request.Pendencia))
            throw new SigenValidationException("Pendência inválida.");

    }
}