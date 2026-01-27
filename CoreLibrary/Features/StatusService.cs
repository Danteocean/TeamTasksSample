using AutoMapper;
using CoreLibrary.DTOs.Status.Response;
using CoreLibrary.Interface.Repositories;
using CoreLibrary.Interface.Services;
using Domain.Querys.Status;
using Domain.Wrappers;
using Microsoft.Extensions.Configuration;

namespace CoreLibrary.Features;

public class StatusService : IStatusService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public StatusService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _mapper = mapper;
    }

    private string ConnectionString => _configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("Missing DefaultConnection");

    public async Task<Response<List<ProjectStatusesDtoResponse>>> GetProjectStatuses()
    {
        try
        {
            GetProjectStatuses getProjectStatuses = new GetProjectStatuses(ConnectionString);

            var (data, message) = await getProjectStatuses.GetProjectStatusesAsync();

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<ProjectStatusesDtoResponse>>(data);

                return new Response<List<ProjectStatusesDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }
            return new Response<List<ProjectStatusesDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<ProjectStatusesDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }

    public async Task<Response<List<TaskPrioritiesDtoResponse>>> GetTaskPriorities()
    {
        try
        {
            GetTaskPriorities getTaskPriorities = new GetTaskPriorities(ConnectionString);
            var (data, message) = await getTaskPriorities.GetTaskPrioritiesAsync();

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<TaskPrioritiesDtoResponse>>(data);
                return new Response<List<TaskPrioritiesDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }

            return new Response<List<TaskPrioritiesDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<TaskPrioritiesDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }

    public async Task<Response<List<TaskStatusesDtoResponse>>> GetTaskStatuses()
    {
        try
        {
            GetTaskStatuses getTaskStatuses = new GetTaskStatuses(ConnectionString);
            var (data, message) =await  getTaskStatuses.GetTaskStatusesAsync();

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<TaskStatusesDtoResponse>>(data);
                return new Response<List<TaskStatusesDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }
            return new Response<List<TaskStatusesDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };

        }
        catch (Exception ex)
        {
            return new Response<List<TaskStatusesDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }

    }
}
