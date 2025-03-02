using System;
using System.Threading.Tasks;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UserRepository;

namespace Find_Your_Home.Repositories.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        Task<bool> SaveAsync(); 
    }
}