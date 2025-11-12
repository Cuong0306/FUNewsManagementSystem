using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace FUNewsManagementSystem.DAL.Repositories.Implementations
{
    public class TagRepository : ITagRepository
    {
        private readonly NewsPortalDBContext _context;

        public TagRepository(NewsPortalDBContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAsync(Tag tag)
        {
            await _context.Tags.AddAsync(tag);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return false;

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Tag>> GetAllAsync()
        {
            return await _context.Tags.ToListAsync();
        }

        public async Task<Tag?> GetByIdAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public async Task<bool> UpdateAsync(Tag tag)
        {
            var existing = await _context.Tags.FindAsync(tag.TagId);
            if (existing == null) return false;

            if (!string.IsNullOrWhiteSpace(tag.TagName))
                existing.TagName = tag.TagName;

            if (!string.IsNullOrWhiteSpace(tag.Note))
                existing.Note = tag.Note;

            _context.Tags.Update(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
