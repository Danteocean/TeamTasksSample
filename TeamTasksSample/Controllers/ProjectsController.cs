using CoreLibrary.DTOs.Projects.Requests;
using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace TeamTasksSample.Controllers;

[Route("api/")]
[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly IProjectsService _projectsService;

    public ProjectsController(IProjectsService projectsService)
    {
        _projectsService = projectsService;
    }

    [HttpGet("projects")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProjectsSummary()
    {
        return Ok(await _projectsService.GetProjectsSummary());
    }

    [HttpGet("projects/{projectId}/tasks")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProjectTasks(int projectId, [FromQuery] ProjectTasksDtoRequest projectTasksDtoRequest)
    {
        return Ok(await _projectsService.GetProjectTasks(projectId, projectTasksDtoRequest));
    }
}
