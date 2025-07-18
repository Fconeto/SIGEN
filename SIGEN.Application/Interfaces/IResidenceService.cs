using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface IResidenceService
{
    Task<long> CreateResidence(ResidenceCreateRequest request);
    Task<List<GetResidenceListResponse>> GetResidenceList(ConsultFiltersRequest request);
}
