using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace TeamTasksSample.Controllers;

[ApiController]
[Route("api/")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;


    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("dashboard/developer-workload")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDeveloperWorkload()
    {
        return Ok(await _dashboardService.GetDeveloperWorkload());
    }

    [HttpGet("dashboard/project-health/{projectId}")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDeveloperWorkload(int projectId)
    {
        return Ok(await _dashboardService.GetProjectHealth(projectId));
    }

    [HttpGet("dashboard/developer-delay-risk")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDeveloperDelayRisk()
    {
        return Ok(await _dashboardService.GetDeveloperDelayRisk());
    }
}