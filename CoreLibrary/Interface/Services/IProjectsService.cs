using CoreLibrary.DTOs.Accident.Response;
using CoreLibrary.DTOs.Projects.Requests;
using CoreLibrary.DTOs.Projects.Response;
using Domain.Wrappers;

namespace CoreLibrary.Interface.Services;

public interface IProjectsService
{
    Task<Response<List<ProjectsSummaryDtoResponse>>> GetProjectsSummary();


    Task<Response<List<ProjectTasksDtoResponse>>> GetProjectTasks(int projectId, ProjectTasksDtoRequest projectTasksDtoRequest);

    
}
