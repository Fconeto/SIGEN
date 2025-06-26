using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Interfaces;

public interface ICreateResidenceService
{
    Task<ResidenceCreateResponse> Execute(ResidenceCreateRequest request);
}
