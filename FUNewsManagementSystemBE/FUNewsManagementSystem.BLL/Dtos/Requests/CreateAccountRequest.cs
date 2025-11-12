using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Requests
{
    public class CreateAccountRequest
    {
        public string? AccountName { get; set; }
        public string? AccountEmail { get; set; }
        public string? AccountRole { get; set; }
        public string? AccountPassword { get; set; }
    }
}
