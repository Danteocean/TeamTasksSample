namespace CoreLibrary.DTOs.Status.Response;

public class TaskPrioritiesDtoResponse
{
    public int TaskPriorityId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public int Level { get; set; }
}