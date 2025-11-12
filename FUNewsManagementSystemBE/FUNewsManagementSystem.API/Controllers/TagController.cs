using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Implementations;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FUNewsManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagController : ControllerBase
    {
        private readonly ITagService _service;

        public TagController(ITagService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Create([FromBody] CreateTagRequest dto)
        {
            var result = await _service.CreateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTagRequest dto)
        {
            dto.TagId = id;
            var result = await _service.UpdateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("search")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> Search([FromQuery] string? name)
        {
            var response = await _service.GetAllTagsAsync();

            if (!string.IsNullOrWhiteSpace(name))
            {
                response.Data = response.Data
                    .Where(t => t.TagName.Contains(name, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            return Ok(response);
        }

    }
}
