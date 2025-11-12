using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Category> CreateAsync(CreateCategoryRequest dto);
        Task<Category> GetByIdAsync(int id);
        Task<List<Category>> GetAllAsync();
        Task<bool> UpdateAsync(UpdateCategoryRequest dto);
        Task<bool> DeleteAsync(int id);
        Task<List<GetAllCategoriesResponse>> GetAllCategoriesAsync();
    }
}
