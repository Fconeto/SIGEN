using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Enums;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Infrastructure.Interfaces;

public interface ISprayRepository
{
    Task<List<GetPendingSprayResponse>> GetPendingSprayListByFilters(
        long codigoDaLocalidade,
        string? nomeDoMorador,
        int? numeroDaCasa,
        string? numeroDoComplemento,
        Order order,
        OrderType orderType,
        int page
    );
    Task<long?> GetSearchWithPendingSprayById(long searchId);
    Task InsertBorrifacao(Spray spray);
}