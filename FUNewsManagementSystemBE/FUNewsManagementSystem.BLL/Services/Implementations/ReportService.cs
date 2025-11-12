using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReportService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<NewsReportResponse>> GetNewsReportAsync(ReportRequest filter)
        {
            var articles = await _unitOfWork.NewsArticles.GetAllAsync();

            var query = articles.AsQueryable();

            if (filter.StartDate.HasValue)
                query = query.Where(a => a.CreatedDate >= filter.StartDate.Value);

            if (filter.EndDate.HasValue)
                query = query.Where(a => a.CreatedDate <= filter.EndDate.Value);

            return query.Select(a => new NewsReportResponse
            {
                NewsArticleId = a.NewsArticleId,
                NewsTitle = a.NewsTitle,
                CreatedDate = a.CreatedDate,
                CategoryName = a.Category == null ? null : a.Category.CategoryName,
                CreatedByName = a.CreatedBy == null ? null : a.CreatedBy.AccountName,
                NewsStatus = a.NewsStatus
            }).ToList();
        }
    }
}
