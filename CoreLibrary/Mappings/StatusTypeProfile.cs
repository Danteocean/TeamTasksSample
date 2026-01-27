using AutoMapper;
using CoreLibrary.DTOs.Status.Response;

namespace CoreLibrary.Mappings;

public class StatusTypeProfile : Profile
{
    public StatusTypeProfile()
    {
        CreateMap<ProjectStatusesDtoResponse, Object>();
        CreateMap<TaskPrioritiesDtoResponse, Object>();
        CreateMap<TaskStatusesDtoResponse, Object>();
    }
}
