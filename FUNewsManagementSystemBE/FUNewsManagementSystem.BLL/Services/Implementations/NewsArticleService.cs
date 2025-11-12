using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class NewsArticleService : INewsArticleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NewsArticleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 🔹 Create bài viết
        public async Task<GetAllNewsArticlesResponse> CreateAsync(CreateNewsArticleRequest dto)
        {
            var article = new NewsArticle
            {
                NewsTitle = dto.NewsTitle,
                Headline = dto.Headline,
                CreatedDate = dto.CreatedDate ?? DateTime.UtcNow,
                NewsContent = dto.NewsContent,
                NewsSource = dto.NewsSource,
                CategoryId = dto.CategoryId,
                NewsStatus = dto.NewsStatus,
                CreatedById = dto.CreatedById,
                UpdatedById = dto.UpdatedById,
                ModifiedDate = dto.ModifiedDate
            };

            if (dto.TagIds != null)
            {
                foreach (var tagId in dto.TagIds)
                    article.Tags.Add(new Tag { TagId = tagId });
            }

            var created = await _unitOfWork.NewsArticles.CreateAsync(article);
            return MapToDto(created);
        }

        // 🔹 Update bài viết
        public async Task<GetAllNewsArticlesResponse> UpdateAsync(UpdateNewsArticleRequest dto)
        {
            var article = await _unitOfWork.NewsArticles.GetByIdAsync(dto.NewsArticleId);
            if (article == null) throw new Exception("Article not found");

            if (!string.IsNullOrWhiteSpace(dto.NewsTitle)) article.NewsTitle = dto.NewsTitle;
            if (!string.IsNullOrWhiteSpace(dto.Headline)) article.Headline = dto.Headline;
            if (dto.CreatedDate != null) article.CreatedDate = dto.CreatedDate;
            if (!string.IsNullOrWhiteSpace(dto.NewsContent)) article.NewsContent = dto.NewsContent;
            if (!string.IsNullOrWhiteSpace(dto.NewsSource)) article.NewsSource = dto.NewsSource;
            if (dto.CategoryId != null) article.CategoryId = dto.CategoryId;
            if (!string.IsNullOrWhiteSpace(dto.NewsStatus)) article.NewsStatus = dto.NewsStatus;
            if (dto.CreatedById != null) article.CreatedById = dto.CreatedById;
            if (dto.UpdatedById != null) article.UpdatedById = dto.UpdatedById;
            if (dto.ModifiedDate != null) article.ModifiedDate = dto.ModifiedDate;

            if (dto.TagIds != null)
            {
                article.Tags.Clear();
                foreach (var tagId in dto.TagIds)
                    article.Tags.Add(new Tag { TagId = tagId });
            }

            var updated = await _unitOfWork.NewsArticles.UpdateAsync(article);
            return MapToDto(article);
        }

        // 🔹 Delete bài viết
        public async Task<bool> DeleteAsync(int id)
        {
            return await _unitOfWork.NewsArticles.DeleteAsync(id);
        }

        // 🔹 Lấy tất cả bài viết (admin)
        public async Task<List<GetAllNewsArticlesResponse>> GetAllAsync()
        {
            var articles = await _unitOfWork.NewsArticles.GetAllAsync();
            return articles.Select(a => MapToDto(a)).ToList();
        }

        // 🔹 Lấy tất cả bài viết active (public)
        public async Task<List<GetAllNewsArticlesResponse>> GetAllActiveAsync()
        {
            var articles = await _unitOfWork.NewsArticles.GetAllAsync();
            return articles
                .Where(a => a.NewsStatus.Equals("Active", StringComparison.OrdinalIgnoreCase))
                .Select(a => MapToDto(a))
                .ToList();
        }

        // 🔹 Lấy bài viết theo Id
        public async Task<GetAllNewsArticlesResponse> GetByIdAsync(int id)
        {
            var article = await _unitOfWork.NewsArticles.GetByIdAsync(id);
            if (article == null) throw new Exception("Article not found");
            return MapToDto(article);
        }

        // 🔹 Search
        public async Task<List<GetAllNewsArticlesResponse>> SearchAsync(SearchNewsArticleRequest filter)
        {
            var articles = await _unitOfWork.NewsArticles.GetAllAsync();
            var query = articles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Title))
                query = query.Where(a => a.NewsTitle.Contains(filter.Title, StringComparison.OrdinalIgnoreCase));

            if (filter.CategoryId != null)
                query = query.Where(a => a.CategoryId == filter.CategoryId);

            if (!string.IsNullOrWhiteSpace(filter.Status))
                query = query.Where(a => a.NewsStatus.Equals(filter.Status, StringComparison.OrdinalIgnoreCase));

            if (filter.TagIds != null && filter.TagIds.Any())
                query = query.Where(a => a.Tags.Any(t => filter.TagIds.Contains(t.TagId)));

            return query.Select(a => MapToDto(a)).ToList();
        }

        // 🔹 Mapper entity -> DTO
        private GetAllNewsArticlesResponse MapToDto(NewsArticle a)
        {
            return new GetAllNewsArticlesResponse
            {
                NewsArticleId = a.NewsArticleId,
                NewsTitle = a.NewsTitle,
                Headline = a.Headline,
                NewsContent = a.NewsContent,
                NewsSource = a.NewsSource,
                NewsStatus = a.NewsStatus,
                CreatedDate = a.CreatedDate,
                ModifiedDate = a.ModifiedDate,
                CategoryId = a.CategoryId,
                CategoryName = a.Category?.CategoryName,
                CreatedById = a.CreatedById,
                CreatedByName = a.CreatedBy?.AccountName,
                UpdatedById = a.UpdatedById,
                UpdatedByName = a.UpdatedBy?.AccountName,
                Tags = a.Tags.Select(t => new TagResponse { TagId = t.TagId, TagName = t.TagName }).ToList()
            };
        }
    }
}
