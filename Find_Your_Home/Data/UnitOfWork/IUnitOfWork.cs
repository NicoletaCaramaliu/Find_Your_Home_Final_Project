
namespace Find_Your_Home.Data.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        Task<bool> SaveAsync(); 
    }
}