using SIGEN.Domain.Entities;

namespace SIGEN.Infrastructure.Interfaces;

public interface ISprayRepository
{
    Task<long?> GetSearchWithPendingSprayById(long searchId);
    Task InsertBorrifacao(Spray spray);
}