using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly NewsPortalDBContext _context;

        public CategoryRepository(NewsPortalDBContext context)
        {
            _context = context;
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.NewsArticles)
                .Include(c => c.InverseParentCategory)
                .ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.NewsArticles)
                .Include(c => c.InverseParentCategory)
                .FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var existing = await _context.Categories.FindAsync(category.CategoryId);
            if (existing == null) return false;

            if (!string.IsNullOrWhiteSpace(category.CategoryName)) existing.CategoryName = category.CategoryName;
            if (!string.IsNullOrWhiteSpace(category.CategoryDescription)) existing.CategoryDescription = category.CategoryDescription;
            if (category.ParentCategoryId != null) existing.ParentCategoryId = category.ParentCategoryId;
            existing.IsActive = category.IsActive;

            _context.Categories.Update(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
