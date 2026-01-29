using CoreLibrary.DTOs.Task.Requests;
using CoreLibrary.DTOs.Task.Response;
using Domain.Wrappers;

namespace CoreLibrary.Interface.Services;

public interface ITaskService
{
    Task<Response<TasksAddDtoResponse>> AddTasks(TasksAddDtoRequest tasksAddDtoResponse);
    Task<Response<TasksUpdateDtoResponse>> UpddateTasks(int id, TaskUpdateRequest taskUpdateRequest);

    Task<Response<List<TaskDtoResponse>>> GetTasks();
}