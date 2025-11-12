using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Responses
{
    public class LoginResponse
    {
        public required string Token { get; set; } = null!;
        public required int ExpiresIn { get; set; }
    }
}
