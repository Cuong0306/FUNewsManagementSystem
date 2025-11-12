using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Interfaces
{
    public interface INewsArticleService
    {
        // 🔹 Tạo bài viết → trả về DTO
        Task<GetAllNewsArticlesResponse> CreateAsync(CreateNewsArticleRequest dto);

        // 🔹 Lấy bài viết theo Id → trả về DTO
        Task<GetAllNewsArticlesResponse> GetByIdAsync(int id);

        // 🔹 Lấy tất cả bài viết (admin) → trả về DTO
        Task<List<GetAllNewsArticlesResponse>> GetAllAsync();

        // 🔹 Lấy tất cả bài viết Active (public) → trả về DTO
        Task<List<GetAllNewsArticlesResponse>> GetAllActiveAsync();

        // 🔹 Cập nhật bài viết → trả về DTO
        Task<GetAllNewsArticlesResponse> UpdateAsync(UpdateNewsArticleRequest dto);

        // 🔹 Xóa bài viết → trả về true/false
        Task<bool> DeleteAsync(int id);

        // 🔹 Search bài viết → trả về DTO list
        Task<List<GetAllNewsArticlesResponse>> SearchAsync(SearchNewsArticleRequest filter);
    }
}
