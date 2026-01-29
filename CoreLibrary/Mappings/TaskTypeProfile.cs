using AutoMapper;
using CoreLibrary.DTOs.Task.Requests;
using CoreLibrary.DTOs.Task.Response;

namespace CoreLibrary.Mappings;

public class TaskTypeProfile : Profile
{
    public TaskTypeProfile()
    {
        CreateMap<DTOs.Task.Requests.TasksAddDtoRequest, Domain.Entities.Task>();
        CreateMap<Domain.Entities.CreateTaskResult, DTOs.Task.Response.TasksAddDtoResponse>();
        CreateMap<Domain.Entities.UpdateTaskResult, DTOs.Task.Response.TasksUpdateDtoResponse>();
        CreateMap<TaskDtoResponse, Object>();
        CreateMap<TaskUpdateRequest, Domain.Entities.Task>();
    }
}