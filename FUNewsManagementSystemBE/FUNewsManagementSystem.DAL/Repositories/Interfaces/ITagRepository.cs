using FUNewsManagementSystem.Domain.Models;

namespace FUNewsManagementSystem.DAL.Repositories.Interfaces
{
    public interface ITagRepository
    {
        Task<bool> CreateAsync(Tag tag);
        Task<bool> UpdateAsync(Tag tag);
        Task<bool> DeleteAsync(int id);
        Task<Tag?> GetByIdAsync(int id);
        Task<List<Tag>> GetAllAsync();
    }
}
