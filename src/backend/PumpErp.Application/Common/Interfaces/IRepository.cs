using System.Linq.Expressions;
using PumpErp.Domain.Common;

namespace PumpErp.Application.Common.Interfaces;

public interface IRepository<TEntity> where TEntity : AuditableEntity
{
    IQueryable<TEntity> Query();
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken);
    void Update(TEntity entity);
}
