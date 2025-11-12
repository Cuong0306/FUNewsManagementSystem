using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNewsManagementSystem.BLL.Dtos
{
    public class BaseResponse<T>
    {
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public T Data { get; set; }

        public BaseResponse() { }

        public BaseResponse(string message, int statusCode, T data)
        {
            Message = message;
            StatusCode = statusCode;
            Data = data;
        }

        // Static helpers
        public static BaseResponse<T> Success(T data, string message = "Success", int statusCode = 200)
        {
            return new BaseResponse<T>(message, statusCode, data);
        }

        public static BaseResponse<T> Fail(string message, int statusCode = 400, T data = default)
        {
            return new BaseResponse<T>(message, statusCode, data);
        }
    }
}
