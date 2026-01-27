using AutoMapper;
using CoreLibrary.DTOs.Accident.Response;
using CoreLibrary.DTOs.Projects.Requests;
using CoreLibrary.DTOs.Projects.Response;
using Domain.Entities;

namespace CoreLibrary.Mappings;

public class ProjectsTypeProfile : Profile
{
    public ProjectsTypeProfile()
    {
        CreateMap<ProjectsSummaryDtoResponse, Object>();

        CreateMap<ProjectTasksFilterRequest, ProjectTasksDtoRequest>();

        CreateMap<ProjectTasksDtoResponse, Object>();
    }
}