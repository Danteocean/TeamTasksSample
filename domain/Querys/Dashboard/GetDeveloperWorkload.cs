using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Dashboard;

public class GetDeveloperWorkload
{
    private readonly string _connectionString;

    private const String query = @"
    SELECT DeveloperId,DeveloperName ,OpenTasksCount ,AverageEstimatedComplexity 
    FROM core.vw_DeveloperWorkload;";

    public GetDeveloperWorkload(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> developerWorkloadAsync, string Message)> GetDeveloperWorkloadAsync()
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "Developer workload retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving Project developer workload: {ex.Message}");
        }
    }
}