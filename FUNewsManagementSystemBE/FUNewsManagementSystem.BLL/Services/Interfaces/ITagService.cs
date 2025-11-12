using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.Domain.Models;

namespace FUNewsManagementSystem.BLL.Services.Interfaces
{
    public interface ITagService
    {
        Task<BaseResponse<Tag>> CreateAsync(CreateTagRequest dto);
        Task<BaseResponse<Tag>> GetByIdAsync(int id);
        Task<BaseResponse<List<Tag>>> GetAllAsync();
        Task<BaseResponse<bool>> UpdateAsync(UpdateTagRequest dto);
        Task<BaseResponse<bool>> DeleteAsync(int id);
        Task<BaseResponse<List<GetAllTagsResponse>>> GetAllTagsAsync();
    }
}
