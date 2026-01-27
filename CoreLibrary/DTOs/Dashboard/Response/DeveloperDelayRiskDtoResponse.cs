namespace CoreLibrary.DTOs.Dashboard.Response;

public class DeveloperDelayRiskDtoResponse
{
    public string? DeveloperName { get; set; }

    public int OpenTasksCount { get; set; }

    public Decimal AvgDelayDays { get; set; }

    public DateTime NearestDueDate { get; set; }

    public DateTime LatestDueDate { get; set; }

    public DateTime PredictedCompletionDate { get; set; }

    public bool HighRiskFlag { get; set; }
}