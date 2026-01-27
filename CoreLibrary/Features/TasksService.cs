using AutoMapper;
using CoreLibrary.DTOs.Task.Requests;
using CoreLibrary.DTOs.Task.Response;
using CoreLibrary.Interface.Repositories;
using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.Extensions.Configuration;

namespace CoreLibrary.Features;

public class TasksService : ITaskService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public TasksService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _mapper = mapper;
    }

    private string ConnectionString => _configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("Missing DefaultConnection");

    public async Task<Response<TasksAddDtoResponse>> AddTasks(TasksAddDtoRequest tasksAddDtoRequest)
    {
        try
        {
            CreateTask createTask = new CreateTask(ConnectionString);
            var result = await createTask.AddTasksAsync(_mapper.Map<Domain.Entities.Task>(tasksAddDtoRequest));

            var data = result.tasks;
            if (data != null)
            {
                var response = _mapper.Map<TasksAddDtoResponse>(data);

                return new Response<TasksAddDtoResponse>(response) { State = "Ok", Message = data.Message, Succeeded = data.Success };
            }

            return new Response<TasksAddDtoResponse>(null) { State = "NoData", Message = data.Message, Succeeded = data.Success };
        }
        catch (Exception ex)
        {
            return new Response<TasksAddDtoResponse>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }

    public async Task<Response<TasksUpdateDtoResponse>> UpddateTasks(int id, TaskUpdateRequest taskUpdateRequest)
    {

        try
        {
            UpdateTask updateTask = new UpdateTask(ConnectionString);
            var result = await updateTask.UpdateTasksAsync(id, _mapper.Map<Domain.Entities.Task>(taskUpdateRequest));
            var data = result.tasks;
            if (data != null)
            {
                var response = _mapper.Map<TasksUpdateDtoResponse>(data);

                return new Response<TasksUpdateDtoResponse>(response) { State = "Ok", Message = data.Message, Succeeded = data.Success };
            }
            return new Response<TasksUpdateDtoResponse>(null) { State = "NoData", Message = data.Message, Succeeded = data.Success };
        }
        catch (Exception ex)
        {
            return new Response<TasksUpdateDtoResponse>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }
}
