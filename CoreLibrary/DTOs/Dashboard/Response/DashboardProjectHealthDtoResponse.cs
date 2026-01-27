namespace CoreLibrary.DTOs.Dashboard.Response;

public class DashboardProjectHealthDtoResponse
{
    public int ProjectId { get; set; }

    public string? ProjectName { get; set; }

    public string? ClientName { get; set; }

    public string? Status { get; set; }

    public int TotalTasks { get; set; }

    public int OpenTasks { get; set; }

    public int CompletedTasks { get; set; }
}