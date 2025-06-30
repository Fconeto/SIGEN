using SIGEN.Domain.Entities;

namespace SIGEN.Infrastructure.Interfaces;

public interface IResidenceRepository
{
    Task InsertResidence(Residence residence);
    Task<Residence> GetResidenciaByLocalidadeAndNumeroAndComplemento(long codigoDaLocalidade, int? numero, string? complemento);
}