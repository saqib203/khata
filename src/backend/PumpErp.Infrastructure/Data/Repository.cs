using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PumpErp.Application.Common.Interfaces;
using PumpErp.Domain.Common;

namespace PumpErp.Infrastructure.Data;

public sealed class Repository<TEntity>(PumpErpDbContext dbContext) : IRepository<TEntity>
    where TEntity : AuditableEntity
{
    public IQueryable<TEntity> Query() => dbContext.Set<TEntity>().AsQueryable();

    public Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Set<TEntity>().FirstOrDefaultAsync(entity => entity.Id == id, cancellationToken);
    }

    public Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken)
    {
        return dbContext.Set<TEntity>().AnyAsync(predicate, cancellationToken);
    }

    public Task AddAsync(TEntity entity, CancellationToken cancellationToken)
    {
        return dbContext.Set<TEntity>().AddAsync(entity, cancellationToken).AsTask();
    }

    public void Update(TEntity entity)
    {
        dbContext.Set<TEntity>().Update(entity);
    }
}
