namespace FUNewsManagementSystem.BLL.Dtos.Responses
{
    public class GetAllNewsArticlesResponse
    {
        public int NewsArticleId { get; set; }
        public string NewsTitle { get; set; }
        public string Headline { get; set; }
        public string NewsContent { get; set; }
        public string NewsSource { get; set; }
        public string NewsStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int? CreatedById { get; set; }
        public string? CreatedByName { get; set; }
        public int? UpdatedById { get; set; }
        public string? UpdatedByName { get; set; }
        public List<TagResponse> Tags { get; set; } = new List<TagResponse>();
    }

    public class TagResponse
    {
        public int TagId { get; set; }
        public string TagName { get; set; }
    }
}
