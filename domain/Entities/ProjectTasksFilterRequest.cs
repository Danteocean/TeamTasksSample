namespace Domain.Entities;

public class ProjectTasksFilterRequest
{
    public int? ProjectId { get; set; }

    public int? StatusCode { get; set; }

    public int? AssigneeId { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}