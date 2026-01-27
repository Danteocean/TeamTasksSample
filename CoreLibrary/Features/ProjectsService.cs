using AutoMapper;
using CoreLibrary.DTOs.Accident.Response;
using CoreLibrary.DTOs.Projects.Requests;
using CoreLibrary.DTOs.Projects.Response;
using CoreLibrary.Interface.Repositories;
using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.Extensions.Configuration;

namespace CoreLibrary.Features;

public class ProjectsService : IProjectsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public ProjectsService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _mapper = mapper;
    }

    private string ConnectionString => _configuration.GetConnectionString("DefaultConnection")
     ?? throw new Exception("Missing DefaultConnection");

 

    public async Task<Response<List<ProjectsSummaryDtoResponse>>> GetProjectsSummary()
    {

        try
        {
            GetProjectsSummary getProjectsSummary = new GetProjectsSummary(ConnectionString);

            var (data, message) = await getProjectsSummary.GetProjectsSummaryAsync();


            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<ProjectsSummaryDtoResponse>>(data);

                return new Response<List<ProjectsSummaryDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }

            return new Response<List<ProjectsSummaryDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<ProjectsSummaryDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }

    public async Task<Response<List<ProjectTasksDtoResponse>>> GetProjectTasks(int projectId, ProjectTasksDtoRequest projectTasksDtoRequest)
    {
        try
        {
            GetProjectTasks getProjectTasks = new GetProjectTasks(ConnectionString);
            Domain.Entities.ProjectTasksFilterRequest projectTasksFilterRequest = new Domain.Entities.ProjectTasksFilterRequest
            {
                ProjectId = projectId,
                StatusCode = projectTasksDtoRequest.StatusCode,
                AssigneeId = projectTasksDtoRequest.AssigneeId,
                Page = projectTasksDtoRequest.Page,
                PageSize = projectTasksDtoRequest.PageSize
            };
            var (data, message) = await getProjectTasks.GetProjectTasksAsync(projectTasksFilterRequest);

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<ProjectTasksDtoResponse>>(data);

                return new Response<List<ProjectTasksDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }

            return new Response<List<ProjectTasksDtoResponse>>(null) { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<ProjectTasksDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }
}
