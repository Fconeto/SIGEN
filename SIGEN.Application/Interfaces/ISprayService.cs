using SIGEN.Domain.Shared.Requests;

namespace SIGEN.Application.Interfaces;

public interface ISprayService
{
    Task CreateSpray(SprayRequest request);
}