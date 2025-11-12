using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Interfaces
{
    public interface IAccountService
    {
        Task<SystemAccount> CreateAccountAsync(CreateAccountRequest dto);
        Task<bool> UpdateAccountAsync(UpdateAccountRequest dto);
        Task<List<GetAllAccountsResponse>> GetAllAccountsAsync();
        Task<SystemAccount> GetByIdAsync(int id);
        Task<bool> DeleteAccountAsync(int id);
    }
}
