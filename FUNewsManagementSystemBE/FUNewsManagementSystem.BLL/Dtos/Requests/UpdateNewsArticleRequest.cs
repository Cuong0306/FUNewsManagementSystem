using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Requests
{
    public class UpdateNewsArticleRequest
    {
        [Required]
        public int NewsArticleId { get; set; }

        public string? NewsTitle { get; set; }
        public string? Headline { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? NewsContent { get; set; }
        public string? NewsSource { get; set; }
        public int? CategoryId { get; set; }
        public string? NewsStatus { get; set; }
        public int? CreatedById { get; set; }
        public int? UpdatedById { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public List<int>? TagIds { get; set; }
    }
}
