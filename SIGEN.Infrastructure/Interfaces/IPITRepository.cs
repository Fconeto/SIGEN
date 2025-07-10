using SIGEN.Domain.Entities;

namespace SIGEN.Infrastructure.Interfaces;

public interface IPITRepository
{
    Task InsertPIT(PIT pit);
}
