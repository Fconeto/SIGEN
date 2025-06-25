using SIGEN.Domain.Entities;
using SIGEN.Domain.Repositories;

namespace SIGEN.Infrastructure.DataAccess.Repositories;

internal class ResidenceRepository : IResidenceWriteOnlyRepository
{
    private readonly SIGENDbContext _dbcontext;

    public ResidenceRepository(SIGENDbContext dbcontext)
    {
        _dbcontext = dbcontext;
    }
    public async Task Add(Residence residence)
    {
        await _dbcontext.Residences.AddAsync(residence);
    }
}