using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface ILocalityRepository
{
    Task<List<GetLocalityListResponse>> GetLocalityList();
    Task<Locality> GetLocalityByCode(long codigoDaLocalidade);
    Task CreateLocality(Locality request);
}
