namespace CoreLibrary.DTOs.Accident.Response;

public class ProjectTasksDtoResponse
{
    public int TaskId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public string? Priority { get; set; }

    public int EstimatedComplexity { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime CompletionDate { get; set; }

    public string? Assignee { get; set; }
}