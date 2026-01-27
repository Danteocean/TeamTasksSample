namespace Domain.Entities;

public class CreateTaskResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }

    public int? TaskId { get; set; }

    public int? ProjectId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int? AssigneeId { get; set; }

    public int? TaskStatusId { get; set; }

    public int? TaskPriorityId { get; set; }

    public int? EstimatedComplexity { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? CompletionDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }
}