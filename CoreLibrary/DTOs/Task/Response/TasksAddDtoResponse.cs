using CoreLibrary.DTOs.Task.Requests;

namespace CoreLibrary.DTOs.Task.Response;

public class TasksAddDtoResponse: TasksAddDtoRequest
{
    public int TaskId { get; set; }
}