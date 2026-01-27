using CoreLibrary.DTOs.Task.Requests;
using CoreLibrary.Interface.Services;
using Domain.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TeamTasksSample.Controllers;

[Route("api/")]
[ApiController]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost("tasks")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddTasks(TasksAddDtoRequest tasksAddDtoRequest)
    {
        return Ok(await _taskService.AddTasks(tasksAddDtoRequest));
    }

    [HttpPut("tasks/{id}/status")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateTasksStatus(int id, TaskUpdateRequest taskUpdateRequest)
    {
        return Ok(await _taskService.UpddateTasks(id, taskUpdateRequest));
    }

}
