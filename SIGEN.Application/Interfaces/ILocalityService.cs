using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface ILocalityService
{
    Task<List<GetLocalityListResponse>> GetLocalityList();
}
