using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface IPITRepository
{
    Task InsertPIT(PIT pit);
    Task<List<GetConsultPITListResponse>> GetPendingPITByFilters(ConsultFiltersRequest request);
    Task<List<GetConsultPITListResponse>> GetPITByFilters(ConsultFiltersRequest consultFiltersRequest);
    Task InsertSearchPIT(SearchPIT searchPIT);
    Task UpdatePesquisaPITById(long id, long? pitId);
    Task<PIT> GetPITById(long id);
}
