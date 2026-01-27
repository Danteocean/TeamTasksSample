using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

public class GetProjectsSummary
{
    private readonly string _connectionString;

    private const String query = @"SELECT ProjectId ,Name ,ClientName ,Status ,TotalTasks ,OpenTasks 
    ,CompletedTasks FROM core.vw_ProjectsSummary;";

    public GetProjectsSummary(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> ProjectsSummary, string Message)> GetProjectsSummaryAsync()
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "ProjectsSummary retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving projectsSummary: {ex.Message}");
        }
    }
}