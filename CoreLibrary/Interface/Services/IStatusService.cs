using CoreLibrary.DTOs.Status.Response;
using Domain.Wrappers;

namespace CoreLibrary.Interface.Services;

public interface IStatusService
{
    Task<Response<List<ProjectStatusesDtoResponse>>> GetProjectStatuses();

    Task<Response<List<TaskPrioritiesDtoResponse>>> GetTaskPriorities();

    Task<Response<List<TaskStatusesDtoResponse>>> GetTaskStatuses();
}
