using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FUNewsManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IAccountService accountService, ILogger<AccountController> logger)
        {
            _accountService = accountService;
            _logger = logger;
        }

        // ------------------ Get All ------------------
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAccounts()
        {
            try
            {
                var accounts = await _accountService.GetAllAccountsAsync();
                return Ok(BaseResponse<List<GetAllAccountsResponse>>.Success(accounts));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get accounts");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        // ------------------ Get By Id ------------------
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            try
            {
                var account = await _accountService.GetByIdAsync(id);
                return Ok(BaseResponse<SystemAccount>.Success(account));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get account with id {id}");
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        // ------------------ Create ------------------
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(BaseResponse<string>.Fail("Invalid request data"));

            try
            {
                var account = await _accountService.CreateAccountAsync(dto);
                return Ok(BaseResponse<SystemAccount>.Success(account, "Account created successfully", 201));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create account");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        // ------------------ Update ------------------
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(BaseResponse<string>.Fail("Invalid request data"));

            try
            {
                dto.AccountId = id; // đảm bảo id từ route
                var success = await _accountService.UpdateAccountAsync(dto);
                if (!success)
                    return BadRequest(BaseResponse<string>.Fail("Update failed"));

                return Ok(BaseResponse<string>.Success(null, "Account updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update account with id {id}");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        // ------------------ Delete ------------------
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                var success = await _accountService.DeleteAccountAsync(id);
                if (!success)
                    return NotFound(BaseResponse<string>.Fail("Account not found", 404));

                return Ok(BaseResponse<string>.Success(null, "Account deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete account with id {id}");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAccounts([FromQuery] string? name, [FromQuery] string? email)
        {
            var accounts = await _accountService.GetAllAccountsAsync();

            if (!string.IsNullOrWhiteSpace(name))
                accounts = accounts.Where(a => a.AccountName.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrWhiteSpace(email))
                accounts = accounts.Where(a => a.AccountEmail.Contains(email, StringComparison.OrdinalIgnoreCase)).ToList();

            return Ok(BaseResponse<List<GetAllAccountsResponse>>.Success(accounts));
        }

    }
}
