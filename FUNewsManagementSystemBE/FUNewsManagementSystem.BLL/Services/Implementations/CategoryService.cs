using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using FUNewsManagementSystem.DAL.Repositories.Interfaces;
using FUNewsManagementSystem.DAL.UnitOfWork;
using FUNewsManagementSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Category> CreateAsync(CreateCategoryRequest dto)
        {
            var category = new Category
            {
                CategoryName = dto.CategoryName,
                CategoryDescription = dto.CategoryDescription,
                ParentCategoryId = dto.ParentCategoryId,
                IsActive = dto.IsActive
            };

            return await _unitOfWork.Categories.CreateAsync(category);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // 1. Lấy category
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                throw new Exception("Category not found");

            // 2. Kiểm tra category có news article chưa
            var articles = await _unitOfWork.NewsArticles.GetAllAsync();
            bool hasArticles = articles.Any(a => a.CategoryId == id);

            if (hasArticles)
                throw new Exception("Cannot delete category: this category has associated news articles.");

            // 3. Thực hiện xóa
            return await _unitOfWork.Categories.DeleteAsync(id);
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _unitOfWork.Categories.GetAllAsync();
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) throw new Exception("Category not found");
            return category;
        }

        public async Task<bool> UpdateAsync(UpdateCategoryRequest dto)
        {
            var category = new Category
            {
                CategoryId = dto.CategoryId,
                CategoryName = dto.CategoryName,
                CategoryDescription = dto.CategoryDescription,
                ParentCategoryId = dto.ParentCategoryId,
                IsActive = dto.IsActive
            };

            return await _unitOfWork.Categories.UpdateAsync(category);
        }

        public async Task<List<GetAllCategoriesResponse>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            return categories.Select(c => new GetAllCategoriesResponse
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                CategoryDescription = c.CategoryDescription,
                IsActive = c.IsActive,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory?.CategoryName
            }).ToList();
        }

    }
}
