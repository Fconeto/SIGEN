using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface ILocalityRepository
{
    Task<List<GetLocalityListResponse>> GetLocalityList();
}
