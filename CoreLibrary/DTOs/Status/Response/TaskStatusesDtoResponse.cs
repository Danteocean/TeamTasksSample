namespace CoreLibrary.DTOs.Status.Response;

public class TaskStatusesDtoResponse
{
    public int TaskStatusId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public bool IsFinal { get; set; }
}