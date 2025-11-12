using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.Repositories.Implementations
{
    public class NewsArticleRepository : INewsArticleRepository
    {
        private readonly NewsPortalDBContext _context;

        public NewsArticleRepository(NewsPortalDBContext context)
        {
            _context = context;
        }

        public async Task<NewsArticle> CreateAsync(NewsArticle article)
        {
            await _context.NewsArticles.AddAsync(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var article = await _context.NewsArticles.FindAsync(id);
            if (article == null) return false;

            _context.NewsArticles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<NewsArticle>> GetAllAsync()
        {
            return await _context.NewsArticles
                .Include(a => a.Category)
                .Include(a => a.CreatedBy)
                .Include(a => a.UpdatedBy)
                .Include(a => a.Tags)
                .ToListAsync();
        }

        public async Task<NewsArticle> GetByIdAsync(int id)
        {
            return await _context.NewsArticles
                .Include(a => a.Category)
                .Include(a => a.CreatedBy)
                .Include(a => a.UpdatedBy)
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.NewsArticleId == id);
        }

        public async Task<bool> UpdateAsync(NewsArticle article)
        {
            var existing = await _context.NewsArticles.FindAsync(article.NewsArticleId);
            if (existing == null) return false;

            if (!string.IsNullOrWhiteSpace(article.NewsTitle)) existing.NewsTitle = article.NewsTitle;
            if (!string.IsNullOrWhiteSpace(article.Headline)) existing.Headline = article.Headline;
            if (article.CreatedDate != null) existing.CreatedDate = article.CreatedDate;
            if (!string.IsNullOrWhiteSpace(article.NewsContent)) existing.NewsContent = article.NewsContent;
            if (!string.IsNullOrWhiteSpace(article.NewsSource)) existing.NewsSource = article.NewsSource;
            if (article.CategoryId != null) existing.CategoryId = article.CategoryId;
            if (!string.IsNullOrWhiteSpace(article.NewsStatus)) existing.NewsStatus = article.NewsStatus;
            if (article.CreatedById != null) existing.CreatedById = article.CreatedById;
            if (article.UpdatedById != null) existing.UpdatedById = article.UpdatedById;
            if (article.ModifiedDate != null) existing.ModifiedDate = article.ModifiedDate;

            _context.NewsArticles.Update(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
