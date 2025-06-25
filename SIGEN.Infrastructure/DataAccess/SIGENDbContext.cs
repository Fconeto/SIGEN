using Microsoft.EntityFrameworkCore;
using SIGEN.Domain.Entities;
namespace SIGEN.Infrastructure.DataAccess;

internal class SIGENDbContext : DbContext
{
    public SIGENDbContext(DbContextOptions<SIGENDbContext> options) : base(options) { }
    public DbSet<Agent> Agents { get; set; }
    public DbSet<Residence> Residences { get; set; }
}