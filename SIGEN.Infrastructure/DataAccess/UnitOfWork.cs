using SIGEN.Domain.Repositories;

namespace SIGEN.Infrastructure.DataAccess;

internal class UnitOfWork : IUnitOfWork
{
    private readonly SIGENDbContext _Dbcontext;
    public UnitOfWork(SIGENDbContext dbcontext)
    {
        _Dbcontext = dbcontext;
    }
    public async Task Commit() => await _Dbcontext.SaveChangesAsync();
}
