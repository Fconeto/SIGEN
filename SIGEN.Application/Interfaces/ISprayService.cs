using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface ISprayService
{
    Task<List<GetPendingSprayResponse>> GetPendingSpray(ConsultFiltersRequest request);
}
