using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;

public static class LocalityValidator
{
    public static void Validate(CreateLocalityRequest request)
    {

        if (request.AgenteId <= 0)
            throw new SigenValidationException("O ID do agente deve ser um número positivo.");

        if (request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("O código da localidade deve ser um número positivo.");

        if (string.IsNullOrWhiteSpace(request.NomeDaLocalidade))
            throw new SigenValidationException("O nome da localidade não pode estar vazio.");

        if (!Enum.IsDefined(typeof(Categoria), request.CategoriaDaLocalidade))
            throw new SigenValidationException("Categoria da localidade inválida.");
    }
        
    public static void Validate(ConsultLocalityListRequest request)
    {
        if (request.CodigoDaLocalidade.HasValue && request.CodigoDaLocalidade <= 0)
            throw new SigenValidationException("O código deve ser um número positivo.");

        if (!string.IsNullOrWhiteSpace(request.Nome) && request.Nome.Length > 100)
            throw new SigenValidationException("O nome da localidade não pode exceder 100 caracteres.");

        if (request.Categoria.HasValue && !Enum.IsDefined(typeof(Categoria), request.Categoria))
            throw new SigenValidationException("Categoria inválida.");

        if (request.Page <= 0)
            throw new SigenValidationException("O número da página deve ser maior que zero.");
    }
}
