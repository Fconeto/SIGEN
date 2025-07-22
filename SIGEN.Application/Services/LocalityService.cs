using SIGEN.Domain.Shared.Responses;
using SIGEN.Application.Interfaces;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class LocalityService : ILocalityService
{
    private readonly ILocalityRepository _localityRepository;

    public LocalityService(ILocalityRepository localityRepository)
    {
        _localityRepository = localityRepository;
    }

    public async Task<List<GetLocalityListResponse>> GetLocalityList()
    {
        return await _localityRepository.GetLocalityList();
    }
}
