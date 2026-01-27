using AutoMapper;
using CoreLibrary.DTOs.Dashboard.Response;
using CoreLibrary.DTOs.Developer.Response;

namespace CoreLibrary.Mappings;

public class DeveloperTypeProfile : Profile
{
    public DeveloperTypeProfile()
    {
        CreateMap<DeveloperWorkloadDtoResponse, Object>();
        CreateMap<DeveloperDtoResponse, Object>();
    }
}