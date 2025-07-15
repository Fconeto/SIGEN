using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Application.Validators;
using SIGEN.Infrastructure.Interfaces;
using SIGEN.Domain.ExeptionsBase;
using System;
using System.Threading.Tasks;

namespace SIGEN.Application.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }
    public int Semana { get; set; }

    public async Task<ReportWeeklyResponse> GetWeeklyReport(ReportWeeklyRequest request)
    {
        try
        {
            ReportValidator.Validate(request);

            ReportWeeklyResponse result = null;

            // Calcula a data inicial da semana informada
            var year = DateTime.Now.Year;
            var jan1 = new DateTime(year, 1, 1);
            int daysOffset = DayOfWeek.Monday - jan1.DayOfWeek;
            var firstMonday = jan1.AddDays(daysOffset);
            var dataInicial = firstMonday.AddDays((request.Semana - 1) * 7);
            var dataFinal = dataInicial.AddDays(6);

            if (request.FaseDeTrabalho == FaseDeTrabalhoEnum.AV)
                result = await _reportRepository.GetAVWeeklyReport(dataInicial, dataFinal, request.Turma);
            else if (request.FaseDeTrabalho == FaseDeTrabalhoEnum.PIT)
                result = await _reportRepository.GetPITWeeklyReport(dataInicial, dataFinal, request.Turma);

            return result;
        }
        catch (Exception ex)
        {
            throw new SigenValidationException(ex.Message);
        }
        
    }
}
