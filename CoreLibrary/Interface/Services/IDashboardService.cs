using CoreLibrary.DTOs.Dashboard.Response;
using Domain.Wrappers;

namespace CoreLibrary.Interface.Services;

public interface IDashboardService
{
    Task<Response<List<DeveloperWorkloadDtoResponse>>> GetDeveloperWorkload();

    Task<Response<List<DashboardProjectHealthDtoResponse>>> GetProjectHealth(int projectId);

    Task<Response<List<DeveloperDelayRiskDtoResponse>>> GetDeveloperDelayRisk();

}