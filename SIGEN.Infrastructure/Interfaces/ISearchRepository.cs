using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface ISearchRepository
{
    Task<List<GetPendingSearchResponse>> GetPendingSearchListByFilters(
        long codigoDaLocalidade,
        string? nomeDoMorador,
        int? numeroDaCasa,
        string? numeroDoComplemento,
        Order order,
        OrderType orderType,
        int page
    );
}