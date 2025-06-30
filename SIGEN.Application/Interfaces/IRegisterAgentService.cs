using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace Application.Interfaces;

public interface IRegisterAgentService
{
    Task<AuthResponse> Execute(RegisterRequest request);
}
