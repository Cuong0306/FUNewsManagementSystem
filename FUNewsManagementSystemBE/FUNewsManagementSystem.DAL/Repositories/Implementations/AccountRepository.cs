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
    public class AccountRepository : IAccountRepository
    {
        private readonly NewsPortalDBContext _context;
        public AccountRepository(NewsPortalDBContext context)
        {
            _context = context;
        }
        public async Task<bool> CreateAsync(SystemAccount user)
        {
            await _context.SystemAccounts.AddAsync(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.SystemAccounts.FindAsync(id);
            if (user == null) return false;
            _context.SystemAccounts.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<SystemAccount>> GetAllAsync()
        {
            return await _context.SystemAccounts
                .ToListAsync();
        }

        public async Task<SystemAccount?> GetByEmailAsync(string email)
        {
            return await _context.SystemAccounts.FirstOrDefaultAsync(u => u.AccountEmail == email);
        }

        public async Task<SystemAccount?> GetByIdAsync(int id)
        {
            return await _context.SystemAccounts.FindAsync(id);
        }

        public async Task<bool> IsEmailExistsAsync(string email, int userId)
        {
            return await _context.SystemAccounts.AnyAsync(u => u.AccountEmail == email && u.AccountId != userId);
        }

        public async Task<bool> UpdateAsync(SystemAccount dto)
        {
            var account = await _context.SystemAccounts.FindAsync(dto.AccountId);
            if (account == null) return false;

            if (!string.IsNullOrWhiteSpace(dto.AccountName)) account.AccountName = dto.AccountName;
            if (!string.IsNullOrWhiteSpace(dto.AccountEmail)) account.AccountEmail = dto.AccountEmail;
            if (!string.IsNullOrWhiteSpace(dto.AccountRole)) account.AccountRole = dto.AccountRole;
            if (!string.IsNullOrWhiteSpace(dto.AccountPassword)) account.AccountPassword = dto.AccountPassword;

            _context.SystemAccounts.Update(account);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
