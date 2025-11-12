using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos.Requests
{
    public class CreateNewsArticleRequest
    {
        [Required]
        public string NewsTitle { get; set; }

        [Required]
        public string Headline { get; set; }

        public DateTime? CreatedDate { get; set; }

        [Required]
        public string NewsContent { get; set; }

        public string NewsSource { get; set; }

        public int? CategoryId { get; set; }

        [Required]
        public string NewsStatus { get; set; }

        public int? CreatedById { get; set; }

        public int? UpdatedById { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public List<int>? TagIds { get; set; }
    }
}
