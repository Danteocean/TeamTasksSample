using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace TeamTasksSample.Controllers;

[ApiController]
[Route("api/")]
public class DeveloperController : ControllerBase
{
    private readonly IDeveloperService _developerService;

    public DeveloperController(IDeveloperService developerService)
    {
        _developerService = developerService;
    }

    [HttpGet("developers")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDevelopers()
    {
        return Ok(await _developerService.GetDeveloper());
    }
}
