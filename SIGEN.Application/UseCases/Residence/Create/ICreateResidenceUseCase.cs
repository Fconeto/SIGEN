using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace Application.UseCases.REsidences.Create;

public interface ICreateResidenceUseCase
{
    Task<ResidenceCreateResponse> Execute(ResidenceCreateRequest request);
}
