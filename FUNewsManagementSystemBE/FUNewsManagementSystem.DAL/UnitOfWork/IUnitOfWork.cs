using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IAccountRepository Accounts { get; }
        INewsArticleRepository NewsArticles { get; }
        ICategoryRepository Categories { get; }
        ITagRepository Tags { get; }
        Task<int> SaveAsync();
    }
}
