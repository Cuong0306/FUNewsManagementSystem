using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly NewsPortalDBContext _context;
        private Hashtable _repositories;
        private bool _disposed;

        public IAccountRepository Accounts { get; }
        public INewsArticleRepository NewsArticles { get; }
        public ICategoryRepository Categories { get; }
        public ITagRepository Tags { get; }
        public UnitOfWork(NewsPortalDBContext context,
            IAccountRepository accountRepository,
            INewsArticleRepository newsArticlesRepository,
            ICategoryRepository categoriesRepository,
            ITagRepository tagsRepository)
        {
            _context = context;
            Accounts = accountRepository;
            NewsArticles = newsArticlesRepository;
            Categories = categoriesRepository;
            Tags = tagsRepository;
        }
        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }
    }
}
