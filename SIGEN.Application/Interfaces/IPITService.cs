using SIGEN.Domain.Shared.Requests;

namespace Application.Interfaces;

public interface IPITService
{
    Task CreatePIT(PITRegisterRequest request);
}