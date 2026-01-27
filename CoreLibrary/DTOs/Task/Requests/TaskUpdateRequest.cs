namespace CoreLibrary.DTOs.Task.Requests;

public class TaskUpdateRequest
{
    public int taskStatusId { get; set; }

    public int taskPriorityId { get; set; }

    public int estimatedComplexity { get; set; }

    public string updatedBy { get; set; }
}