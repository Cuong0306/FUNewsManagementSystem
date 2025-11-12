using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;
        public AccountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<SystemAccount> CreateAccountAsync(CreateAccountRequest dto)
        {
            if (await _unitOfWork.Accounts.GetByEmailAsync(dto.AccountEmail) != null)
                throw new Exception("Email already exists");

            var newAccount = new SystemAccount
            {
                AccountName = dto.AccountName,
                AccountEmail = dto.AccountEmail,
                AccountRole = dto.AccountRole,
                AccountPassword = dto.AccountPassword
            };

            var success = await _unitOfWork.Accounts.CreateAsync(newAccount);
            if (!success) throw new Exception("Failed to create account");

            return newAccount;
        }
        public async Task<bool> DeleteAccountAsync(int id)
        {
            // 1. Lấy account
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);
            if (account == null)
                throw new Exception("Account not found");

            // 2. Kiểm tra account đã tạo news article chưa
            var articles = await _unitOfWork.NewsArticles.GetAllAsync(); // lấy tất cả news articles
            bool hasCreatedArticles = articles.Any(a => a.CreatedById == id);

            if (hasCreatedArticles)
                throw new Exception("Cannot delete account: this account has created news articles.");

            // 3. Thực hiện xóa
            return await _unitOfWork.Accounts.DeleteUserAsync(id);
        }

        public async Task<List<GetAllAccountsResponse>> GetAllAccountsAsync()
        {
            var users = await _unitOfWork.Accounts.GetAllAsync();
            return users.Select(u => new GetAllAccountsResponse
            {
                AccountId = u.AccountId,
                AccountName = u.AccountName,
                AccountEmail = u.AccountEmail,
                AccountRole = u.AccountRole
            }).ToList();
        }

        public async Task<SystemAccount> GetByIdAsync(int id)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);
            if (account == null) throw new Exception("Account not found");
            return account;
        }

        public async Task<bool> UpdateAccountAsync(UpdateAccountRequest dto)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(dto.AccountId);
            if (account == null)
                throw new Exception("Account not found");

            if (!string.IsNullOrWhiteSpace(dto.AccountName))
                account.AccountName = dto.AccountName;

            if (!string.IsNullOrWhiteSpace(dto.AccountEmail))
                account.AccountEmail = dto.AccountEmail;

            if (!string.IsNullOrWhiteSpace(dto.AccountRole))
                account.AccountRole = dto.AccountRole;

            if (!string.IsNullOrWhiteSpace(dto.AccountPassword))
                account.AccountPassword = dto.AccountPassword;

            
            return await _unitOfWork.Accounts.UpdateAsync(account);
        }

    }
}
