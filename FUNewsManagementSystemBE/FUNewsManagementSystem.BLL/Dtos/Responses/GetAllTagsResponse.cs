using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Responses
{
    public class GetAllTagsResponse
    {
        public int TagId { get; set; }
        public string TagName { get; set; }
        public string Note { get; set; }
    }
}
