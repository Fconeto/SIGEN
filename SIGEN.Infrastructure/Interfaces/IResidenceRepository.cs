using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface IResidenceRepository
{
    Task<long> InsertResidence(Residence residence);
    Task<Residence> GetResidenciaByLocalidadeAndNumeroAndComplemento(long codigoDaLocalidade, int? numero, string? complemento);
    Task<List<GetResidenceListResponse>> GetResidenceListByFilters(
        long codigoDaLocalidade,
        string? nomeDoMorador,
        int? numeroDaCasa,
        string? numeroDoComplemento,
        Order order,
        OrderType orderType,
        int page
    );
}