using SIGEN.Domain.Entities;

namespace SIGEN.Domain.Repositories;

public interface IResidenceRepository
{
    Task Add(Residence residence);
}