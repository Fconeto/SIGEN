using SIGEN.Domain.Entities;

namespace SIGEN.Domain.Repositories;

public interface IResidenceWriteOnlyRepository
{
    Task Add(Residence residence);
}