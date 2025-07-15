using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Enums;
using System.Threading.Tasks;

namespace SIGEN.Infrastructure.Interfaces;

public interface IReportRepository
{
    Task<ReportWeeklyResponse> GetAVWeeklyReport(DateTime dataInicial, DateTime dataFinal, Turma turma);
    Task<ReportWeeklyResponse> GetPITWeeklyReport(DateTime dataInicial, DateTime dataFinal, Turma turma);
}
