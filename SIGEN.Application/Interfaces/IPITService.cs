using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface IPITService
{
    Task CreatePIT(PITRegisterRequest request);
    Task<SearchPITResponse> ConsultPIT(ConsultFiltersRequest request);
}