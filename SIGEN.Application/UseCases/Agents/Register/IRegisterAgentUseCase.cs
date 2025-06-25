using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace Application.UseCases.Agents.Register;

public interface IRegisterAgentUseCase
{
    Task<AuthResponse> Execute(RegisterRequest request);
}
