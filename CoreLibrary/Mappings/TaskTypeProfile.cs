using AutoMapper;
using CoreLibrary.DTOs.Task.Requests;

namespace CoreLibrary.Mappings;

public class TaskTypeProfile : Profile
{
    public TaskTypeProfile()
    {
        CreateMap<DTOs.Task.Requests.TasksAddDtoRequest, Domain.Entities.Task>();
        CreateMap<Domain.Entities.CreateTaskResult, DTOs.Task.Response.TasksAddDtoResponse>();
        CreateMap<Domain.Entities.UpdateTaskResult, DTOs.Task.Response.TasksUpdateDtoResponse>();
        CreateMap<TaskUpdateRequest, Domain.Entities.Task>();
    }
}