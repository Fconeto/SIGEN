using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Validators;

public class SearchPITValidator
{
    public void Validate(SearchPITRequest request)
    {
        if (request.AgenteId == null)
            throw new SigenValidationException("O ID do agente é obrigatório.");

        if (request.PITId == null)
            throw new SigenValidationException("O ID do PIT deve ser um número positivo.");

        if (!Enum.IsDefined(typeof(PendingSearchStatus), request.Pendencia))
            throw new SigenValidationException("O status de pendência é obrigatório.");

        if (request.NumeroDeHabitantes < 0)
            throw new SigenValidationException("O número de habitantes não pode ser negativo.");

        if (!Enum.IsDefined(typeof(PendingSearchStatus), request.TipoDeParede))
            throw new SigenValidationException("O tipo de parede é obrigatório.");

        if (request.CapturaIntra && request.CapturaPeri == false || request.CapturaPeri && request.CapturaIntra == true)
            throw new SigenValidationException("Não é possível capturar ambos Intra e Peri ao mesmo tempo.");
        if (request.AnexosPositivos < 0)
            throw new SigenValidationException("O número de anexos positivos não pode ser negativo.");

        if (request.AnexosNegativos < 0)
            throw new SigenValidationException("O número de anexos negativos não pode ser negativo.");

        if (request.NumGatos < 0)
            throw new SigenValidationException("O número de gatos não pode ser negativo.");

        if (request.NumCachorros < 0)
            throw new SigenValidationException("O número de cachorros não pode ser negativo.");

    }

    public void Validate(ConsultFiltersRequest request)
    {
        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");
    }
}