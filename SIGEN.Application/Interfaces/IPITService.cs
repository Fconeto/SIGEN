using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Interfaces;

public interface IPITService
{
    Task CreatePIT(PITRegisterRequest request);
}