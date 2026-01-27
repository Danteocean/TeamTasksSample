namespace CoreLibrary.DTOs.Dashboard.Response;

public class DeveloperWorkloadDtoResponse
{
    public int DeveloperId { get; set; }

    public string? DeveloperName { get; set; }

    public int OpenTasksCount { get; set; }

    public int AverageEstimatedComplexity { get; set; }
}