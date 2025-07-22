using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Validators;

public class PITValidator
{
    public void Validate(PITRegisterRequest request)
    {
        if (request.AgenteId == null)
            throw new SigenValidationException("AgenteId é obrigatório.");

        if (string.IsNullOrWhiteSpace(request.Cres))
            throw new SigenValidationException("Cres é obrigatório.");

        if (string.IsNullOrWhiteSpace(request.Municipio))
            throw new SigenValidationException("Município é obrigatório.");

        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade deve ser maior que zero.");

        if (request.NumeroDaCasa <= 0)
            throw new SigenValidationException("Número da casa deve ser maior que zero.");

        if (string.IsNullOrWhiteSpace(request.LocalOndeEncontrou))
            throw new SigenValidationException("Local onde encontrou o inseto é obrigatório.");

        if (string.IsNullOrWhiteSpace(request.NomeDoCapturador))
            throw new SigenValidationException("Nome do capturador é obrigatório.");

        if (Enum.IsDefined(typeof(TipoDeInsetoEnum), request.TipoDoInseto) == false)
            throw new SigenValidationException("Tipo do inseto é inválido.");

        if (request.TipoDoInseto == TipoDeInsetoEnum.Outro && string.IsNullOrWhiteSpace(request.OutroTipoDeInseto))
            throw new SigenValidationException("Outro tipo de inseto é obrigatório quando o tipo do inseto for 'Outro'.");

        if (string.IsNullOrWhiteSpace(request.NomeDoRecebedor))
            throw new SigenValidationException("Nome do recebedor é obrigatório.");
    }

    public void Validate(ConsultFiltersRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");

        if (!Enum.IsDefined(typeof(Order), request.Order) || !Enum.IsDefined(typeof(OrderType), request.OrderType))
            throw new SigenValidationException("Tipo de ordenação inválido.");
    }
}