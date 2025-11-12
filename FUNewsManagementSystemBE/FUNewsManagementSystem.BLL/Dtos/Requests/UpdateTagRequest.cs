using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Requests
{
    public class UpdateTagRequest
    {
        public int TagId { get; set; }
        public string TagName { get; set; }
        public string Note { get; set; }
    }
}
