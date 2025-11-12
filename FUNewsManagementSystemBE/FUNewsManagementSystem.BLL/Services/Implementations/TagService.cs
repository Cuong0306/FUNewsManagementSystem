using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using FUNewsManagementSystem.Domain.Models;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class TagService : ITagService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TagService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse<Tag>> CreateAsync(CreateTagRequest dto)
        {
            var tag = new Tag
            {
                TagName = dto.TagName,
                Note = dto.Note
            };

            var success = await _unitOfWork.Tags.CreateAsync(tag);
            if (!success) return BaseResponse<Tag>.Fail("Failed to create tag");

            return BaseResponse<Tag>.Success(tag, "Tag created successfully");
        }

        public async Task<BaseResponse<bool>> DeleteAsync(int id)
        {
            var success = await _unitOfWork.Tags.DeleteAsync(id);
            if (!success) return BaseResponse<bool>.Fail("Tag not found or delete failed", 404);

            return BaseResponse<bool>.Success(true, "Tag deleted successfully");
        }

        public async Task<BaseResponse<List<Tag>>> GetAllAsync()
        {
            var tags = await _unitOfWork.Tags.GetAllAsync();
            return BaseResponse<List<Tag>>.Success(tags);
        }

        public async Task<BaseResponse<Tag>> GetByIdAsync(int id)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(id);
            if (tag == null) return BaseResponse<Tag>.Fail("Tag not found", 404);

            return BaseResponse<Tag>.Success(tag);
        }

        public async Task<BaseResponse<bool>> UpdateAsync(UpdateTagRequest dto)
        {
            var tag = new Tag
            {
                TagId = dto.TagId,
                TagName = dto.TagName,
                Note = dto.Note
            };

            var success = await _unitOfWork.Tags.UpdateAsync(tag);
            if (!success) return BaseResponse<bool>.Fail("Update failed", 404);

            return BaseResponse<bool>.Success(true, "Tag updated successfully");
        }

        public async Task<BaseResponse<List<GetAllTagsResponse>>> GetAllTagsAsync()
        {
            var tags = await _unitOfWork.Tags.GetAllAsync();

            var dtos = tags.Select(t => new GetAllTagsResponse
            {
                TagId = t.TagId,
                TagName = t.TagName,
                Note = t.Note
            }).ToList();

            return BaseResponse<List<GetAllTagsResponse>>.Success(dtos);
        }

    }
}
