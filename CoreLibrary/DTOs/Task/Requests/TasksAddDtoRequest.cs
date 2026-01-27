namespace CoreLibrary.DTOs.Task.Requests;

public class TasksAddDtoRequest
{
    public int ProjectId { get; set; }

    public string Title { get; set; }

    public string? Description { get; set; }

    public int AssigneeId { get; set; }

    public int TaskStatusId { get; set; }

    public int TaskPriorityId { get; set; }

    public int EstimatedComplexity { get; set; }

    public DateTime DueDate { get; set; }

    public string? CreatedBy { get; set; }

}