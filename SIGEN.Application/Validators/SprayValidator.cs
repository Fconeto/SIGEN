using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Validators;

public class SprayValidator
{
    public void Validate(SprayRequest request)
    {
        if (request.DataDoPreenchimento == default)
            throw new SigenValidationException("A Data do Preenchimento é obrigatória.");

        if(request.TipoDeInseticida == null)
            throw new SigenValidationException("O Tipo de Inseticida é obrigatório.");
            
        if (request.NumeroDeCarga <= 0)
            throw new SigenValidationException("O Número de Carga deve ser um número positivo."); 

        }
}