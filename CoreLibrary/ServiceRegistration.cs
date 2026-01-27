
using CoreLibrary.Features;
using CoreLibrary.Interface.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Microservice.core;

public static class ServiceRegistration
{
    public static void AddCoreLayer(this IServiceCollection services)
    {
        services.AddTransient<IProjectsService, ProjectsService>();
        services.AddTransient<IDashboardService, DashboardService>();
        services.AddTransient<ITaskService, TasksService>();
        services.AddTransient<IDeveloperService, DeveloperService>();
        services.AddTransient<IStatusService, StatusService>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    }
}