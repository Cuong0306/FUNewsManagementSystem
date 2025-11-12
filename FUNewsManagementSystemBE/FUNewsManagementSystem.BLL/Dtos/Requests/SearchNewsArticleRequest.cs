using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Requests
{
    public class SearchNewsArticleRequest
    {
        public string? Title { get; set; }
        public int? CategoryId { get; set; }
        public string? Status { get; set; }
        public List<int>? TagIds { get; set; }
    }
}
