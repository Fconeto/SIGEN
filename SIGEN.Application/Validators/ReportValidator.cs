using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Enums;

public static class ReportValidator
{
    public static void Validate(ReportWeeklyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Microregional))
            throw new SigenValidationException("Microregional é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.Municipio))
            throw new SigenValidationException("Município é obrigatório.");
        if (!Enum.IsDefined(typeof(FaseDeTrabalhoEnum), request.FaseDeTrabalho))
            throw new SigenValidationException("Fase de trabalho inválida.");
        if (request.Semana <= 0)
            throw new SigenValidationException("Semana deve ser maior que zero.");
        if (!Enum.IsDefined(typeof(Turma), request.Turma))
            throw new SigenValidationException("Turma inválida.");
        if (string.IsNullOrWhiteSpace(request.GuardaChefe))
            throw new SigenValidationException("Guarda Chefe é obrigatório.");
    }
}
