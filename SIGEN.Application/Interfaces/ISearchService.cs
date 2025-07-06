using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface ISearchService
{
    Task<List<GetPendingSearchResponse>> GetPendingSearch(ConsultFiltersRequest request);
}
