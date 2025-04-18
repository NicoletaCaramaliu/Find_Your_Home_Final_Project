using Find_Your_Home.Models.Base;
using System.Linq.Expressions;

namespace Find_Your_Home.Repositories.GenericRepository
{
    public interface IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        // Get all data
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IQueryable<TEntity>> GetAllQueryableAsync();


        // Create
        void Create(TEntity entity);
        Task CreateAsync(TEntity entity);
        void CreateRange(IEnumerable<TEntity> entities);
        Task CreateRangeAsync(IEnumerable<TEntity> entities);


        // Update
        TEntity Update(TEntity entity);
        void UpdateRange(IEnumerable<TEntity> entities);

        // Delete 
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);


        // Find
        TEntity FindById(Guid id);
        Task<TEntity> FindByIdAsync(Guid id);

        Task<TEntity> FindSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);

        // Save
        bool Save();
        Task<bool> SaveAsync();
    }
}