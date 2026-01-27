using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

public class GetDeveloperDelayRisk
{
    private readonly string _connectionString;

    private const String query = @"
    SELECT DeveloperName ,OpenTasksCount ,AvgDelayDays ,NearestDueDate ,LatestDueDate ,
    PredictedCompletionDate ,HighRiskFlag FROM core.vw_DeveloperDelayRisk; ";

    public GetDeveloperDelayRisk(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> developerDelayRisk, string Message)> GetDeveloperDelayRiskAsync()
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

         

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "Developer delay risk retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving developer delay risk: {ex.Message}");
        }
    }
}
