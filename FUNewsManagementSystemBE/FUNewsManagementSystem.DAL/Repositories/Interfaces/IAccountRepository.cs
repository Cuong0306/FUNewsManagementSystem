using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.DAL.Repositories.Interfaces
{
    public interface IAccountRepository
    {
        Task<SystemAccount?> GetByIdAsync(int id);
        Task<SystemAccount?> GetByEmailAsync(string email);
        Task<Boolean> IsEmailExistsAsync(string email, int userId);
        Task<Boolean> CreateAsync(SystemAccount user);
        Task<bool> UpdateAsync(SystemAccount dto);
        Task<List<SystemAccount>> GetAllAsync();
        Task<bool> DeleteUserAsync(int id);

    }
}
