using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Application.Validators;

public class SearchValidator
{
    public void Validate(ConsultFiltersRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");

        if (!Enum.IsDefined(typeof(Order), request.Order) || !Enum.IsDefined(typeof(OrderType), request.OrderType))
            throw new SigenValidationException("Tipo de ordenação inválido.");
    }

    public void Validate(CreateSearchRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NomeDoMorador))
            throw new SigenValidationException("O nome do morador é obrigatório.");

        if (!Enum.IsDefined(typeof(PendingSearchStatus), request.Pendencia))
            throw new SigenValidationException("O status da pendência informada é inválido.");

        if (request.NumeroDeHabitantes <= 0)
            throw new SigenValidationException("O número de habitantes deve ser maior que zero.");

        if (request.TipoDeParede == WallType.Outros && string.IsNullOrWhiteSpace(request.OutrosTipoDeParede))
            throw new SigenValidationException("O tipo de parede 'Outros' requer uma descrição.");

        if (request.TipoDeTeto == CeilingType.Outros && string.IsNullOrWhiteSpace(request.OutrosTipoDeTeto))
            throw new SigenValidationException("O tipo de teto 'Outros' requer uma descrição.");
    }    
}