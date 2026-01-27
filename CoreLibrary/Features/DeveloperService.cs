using AutoMapper;
using CoreLibrary.DTOs.Developer.Response;
using CoreLibrary.Interface.Repositories;
using CoreLibrary.Interface.Services;
using Domain.Querys.Developer;
using Domain.Wrappers;
using Microsoft.Extensions.Configuration;

namespace CoreLibrary.Features;

public class DeveloperService : IDeveloperService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public DeveloperService(IUnitOfWork unitOfWork, IConfiguration configuration, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _mapper = mapper;
    }

    private string ConnectionString => _configuration.GetConnectionString("DefaultConnection")
     ?? throw new Exception("Missing DefaultConnection");

    public Task<Response<List<DeveloperDtoResponse>>> GetDeveloper()
    {
        try
        {
            GetDeveloper getDeveloper = new GetDeveloper(ConnectionString);

            var (data, message) = getDeveloper.GetDeveloperAsync().Result;
            if (data.Count != 0 || data.Any())
            {
                var mappedData = _mapper.Map<List<DeveloperDtoResponse>>(data);
                return Task.FromResult(new Response<List<DeveloperDtoResponse>>(mappedData) { State = "Ok", Message = message, Succeeded = true });
            }

            return Task.FromResult(new Response<List<DeveloperDtoResponse>>(null)
            { State = "NoData", Message = message, Succeeded = true });
        }
        catch (Exception ex)
        {
            return Task.FromResult(new Response<List<DeveloperDtoResponse>>(null)
            { State = "NoData", Message = ex.Message, Succeeded = true });
        }
    }
}