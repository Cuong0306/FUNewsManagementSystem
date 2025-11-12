using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Dtos.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Services.Interfaces
{
    public interface IReportService
    {
        Task<List<NewsReportResponse>> GetNewsReportAsync(ReportRequest filter);
    }
}
