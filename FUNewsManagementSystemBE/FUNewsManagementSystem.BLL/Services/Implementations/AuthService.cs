using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using FUNewsManagementSystem.Domain.Config;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly DefaultAdminAccountSettings _defaultAdmin;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(
            IUnitOfWork unitOfWork,
            IOptions<JwtSettings> jwtOptions,
            IOptions<DefaultAdminAccountSettings> adminOptions)
        {
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtOptions.Value;
            _defaultAdmin = adminOptions.Value;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest dto)
        {
            if (dto.Email.Equals(_defaultAdmin.Email, StringComparison.OrdinalIgnoreCase)
        && dto.Password == _defaultAdmin.Password)
            {
                return GenerateJwtToken(
                    id: Guid.Empty.ToString(),
                    name: "System Administrator",
                    email: _defaultAdmin.Email,
                    role: "Admin");
            }

            // 2️⃣ Check user trong database (không hash)
            var account = await _unitOfWork.Accounts.GetByEmailAsync(dto.Email);
            if (account == null || dto.Password != account.AccountPassword)
                throw new Exception("Invalid email or password");

            return GenerateJwtToken(
                id: account.AccountId.ToString(),
                name: account.AccountName,
                email: account.AccountEmail,
                role: account.AccountRole);
        }

        private LoginResponse GenerateJwtToken(string id, string name, string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);
            var now = DateTime.UtcNow;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = now.AddMinutes(_jwtSettings.ExpiryMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return new LoginResponse
            {
                Token = tokenHandler.WriteToken(token),
                ExpiresIn = _jwtSettings.ExpiryMinutes * 60
            };
        }
    }
}
