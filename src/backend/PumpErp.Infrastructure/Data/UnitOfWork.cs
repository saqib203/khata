using PumpErp.Application.Common.Interfaces;

namespace PumpErp.Infrastructure.Data;

public sealed class UnitOfWork(PumpErpDbContext dbContext) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }
}
