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
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryService service, ILogger<CategoryController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _service.GetAllAsync();
                return Ok(BaseResponse<List<Category>>.Success(categories));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get categories");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _service.GetByIdAsync(id);
                return Ok(BaseResponse<Category>.Success(category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get category {id}");
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest dto)
        {
            try
            {
                var category = await _service.CreateAsync(dto);
                return Ok(BaseResponse<Category>.Success(category, "Category created", 201));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create category");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryRequest dto)
        {
            try
            {
                dto.CategoryId = id;
                var success = await _service.UpdateAsync(dto);
                if (!success) return BadRequest(BaseResponse<string>.Fail("Update failed"));
                return Ok(BaseResponse<string>.Success(null, "Category updated"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update category {id}");
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
                if (!success) return NotFound(BaseResponse<string>.Fail("Category not found", 404));
                return Ok(BaseResponse<string>.Success(null, "Category deleted"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete category {id}");
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetCategories([FromQuery] string? name)
        {
            var categories = await _service.GetAllCategoriesAsync();

            if (!string.IsNullOrWhiteSpace(name))
                categories = categories
                    .Where(c => c.CategoryName.Contains(name, StringComparison.OrdinalIgnoreCase))
                    .ToList();

            return Ok(BaseResponse<List<GetAllCategoriesResponse>>.Success(categories));
        }


    }
}
