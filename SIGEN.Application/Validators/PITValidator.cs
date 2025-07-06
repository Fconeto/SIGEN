using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Validators;

public class PITValidator
{
    public void Validate(PITRegisterRequest request)
    {
        if (request.CodigoDaLocalidade == null)
            throw new SigenValidationException("Código da localidade é obrigatório e deve ser um número positivo.");

        if (request.OndeEncontrou == null)
            throw new SigenValidationException("Onde encontrou é obrigatório.");

        if (request.LocalOndeEntrou == null)
            throw new SigenValidationException("Local onde entrou é obrigatório.");

        if (request.NomeDoCapturador == null)
            throw new SigenValidationException("Nome do capturador é obrigatório.");

        if (request.TipoDoInseto == null)
            throw new SigenValidationException("Tipo de inseto é obrigatório.");

        if (request.TipoDoInseto != null && request.OutroTipoDeInseto != null)
            throw new SigenValidationException("Se o tipo de inseto for especificado, o outro tipo de inseto não deve ser preenchido.");
        
    }
}