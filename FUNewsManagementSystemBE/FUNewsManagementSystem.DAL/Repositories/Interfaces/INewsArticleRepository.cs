using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.Repositories.Interfaces
{
    public interface INewsArticleRepository
    {
        Task<NewsArticle> CreateAsync(NewsArticle article);
        Task<bool> DeleteAsync(int id);
        Task<List<NewsArticle>> GetAllAsync();
        Task<NewsArticle> GetByIdAsync(int id);
        Task<bool> UpdateAsync(NewsArticle article);
    }
}
