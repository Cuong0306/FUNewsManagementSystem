using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Responses
{
    public class NewsReportResponse
    {
        public int NewsArticleId { get; set; }
        public string? NewsTitle { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CategoryName { get; set; }
        public string? CreatedByName { get; set; }
        public string? NewsStatus { get; set; }
    }
}
