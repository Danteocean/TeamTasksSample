using AutoMapper;
using CoreLibrary.DTOs.Dashboard.Response;
using CoreLibrary.Interface.Repositories;
using CoreLibrary.Interface.Services;
using Domain.Querys.Dashboard;
using Domain.Wrappers;
using Microsoft.Extensions.Configuration;

namespace CoreLibrary.Features;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public DashboardService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _mapper = mapper;
    }

    private string ConnectionString => _configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("Missing DefaultConnection");


    public async Task<Response<List<DashboardProjectHealthDtoResponse>>> GetProjectHealth(int projectId)
    {

        try
        {
            GetDashboardProjectHealth getProjectHealth = new GetDashboardProjectHealth(ConnectionString);

            var (data, message) = await getProjectHealth.GetProjectHealthAsync(projectId);

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<DashboardProjectHealthDtoResponse>>(data);
                return new Response<List<DashboardProjectHealthDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }
            return new Response<List<DashboardProjectHealthDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<DashboardProjectHealthDtoResponse>>(null)
            { State = "NoData", Message = ex.Message, Succeeded = true };
        }
    }


    public async Task<Response<List<DeveloperWorkloadDtoResponse>>> GetDeveloperWorkload()
    {

        try
        {
            GetDeveloperWorkload getDeveloperWorkload = new GetDeveloperWorkload(ConnectionString);
            var (data, message) = await getDeveloperWorkload.GetDeveloperWorkloadAsync();
            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<DeveloperWorkloadDtoResponse>>(data);
                return new Response<List<DeveloperWorkloadDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }

            return new Response<List<DeveloperWorkloadDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {

            return new Response<List<DeveloperWorkloadDtoResponse>>(null) { State = "NoData", Message = ex.Message, Succeeded = false };
        }
    }

    public async Task<Response<List<DeveloperDelayRiskDtoResponse>>> GetDeveloperDelayRisk()
    {
        try
        {
            GetDeveloperDelayRisk getDeveloperDelayRisk = new GetDeveloperDelayRisk(ConnectionString);

            var (data, message) = await getDeveloperDelayRisk.GetDeveloperDelayRiskAsync();

            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<DeveloperDelayRiskDtoResponse>>(data);
                return new Response<List<DeveloperDelayRiskDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true };
            }
            return new Response<List<DeveloperDelayRiskDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true };
        }
        catch (Exception ex)
        {
            return new Response<List<DeveloperDelayRiskDtoResponse>>(null) 
            { State = "NoData", Message = ex.Message, Succeeded = true };
        }
    }
}