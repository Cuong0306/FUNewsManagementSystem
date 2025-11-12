using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Implementations;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsArticleController : ControllerBase
    {
        private readonly INewsArticleService _service;
        private readonly ILogger<NewsArticleController> _logger;

        public NewsArticleController(INewsArticleService service, ILogger<NewsArticleController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var articles = await _service.GetAllAsync();
                return Ok(BaseResponse<List<GetAllNewsArticlesResponse>>.Success(articles));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get articles");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var article = await _service.GetByIdAsync(id);
                return Ok(BaseResponse<GetAllNewsArticlesResponse>.Success(article));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get article {id}");
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpPost]
        [Authorize(Roles ="Staff")]
        public async Task<IActionResult> Create([FromBody] CreateNewsArticleRequest dto)
        {
            try
            {
                var article = await _service.CreateAsync(dto);
                return Ok(BaseResponse<GetAllNewsArticlesResponse>.Success(article, "Article created", 201));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create article");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateNewsArticleRequest dto)
        {
            try
            {
                dto.NewsArticleId = id;
                var updatedArticle = await _service.UpdateAsync(dto);
                if (updatedArticle == null)
                    return BadRequest(BaseResponse<string>.Fail("Update failed"));

                return Ok(BaseResponse<GetAllNewsArticlesResponse>.Success(updatedArticle, "Article updated"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update article {id}");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _service.DeleteAsync(id);
                if (!success) return NotFound(BaseResponse<string>.Fail("Article not found", 404));
                return Ok(BaseResponse<string>.Success(null, "Article deleted"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete article {id}");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> Search(
            [FromQuery] string? title,
            [FromQuery] int? categoryId,
            [FromQuery] string? status,
            [FromQuery] List<int>? tagIds)
        {
            var filter = new SearchNewsArticleRequest
            {
                Title = title,
                CategoryId = categoryId,
                Status = status,
                TagIds = tagIds
            };

            var articles = await _service.SearchAsync(filter);

            return Ok(BaseResponse<List<GetAllNewsArticlesResponse>>.Success(articles));
        }

        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicNews()
        {
            var articles = await _service.GetAllActiveAsync();
            return Ok(BaseResponse<List<GetAllNewsArticlesResponse>>.Success(articles));
        }
    }

}

