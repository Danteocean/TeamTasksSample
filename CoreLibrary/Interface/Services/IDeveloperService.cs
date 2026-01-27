using CoreLibrary.DTOs.Developer.Response;
using Domain.Wrappers;

namespace CoreLibrary.Interface.Services;

public interface IDeveloperService
{
    Task<Response<List<DeveloperDtoResponse>>> GetDeveloper();
}