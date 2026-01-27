using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

public class GetDashboardProjectHealth
{
    private readonly string _connectionString;

    private const String query = @"
    EXEC core.usp_GetProjectHealth @ProjectId = @ProjectId ";

    public GetDashboardProjectHealth(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> projectHealth, string Message)> GetProjectHealthAsync(int projectId)
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var parameters = new
            {
                ProjectId = projectId

            };

            var data = await db.QueryAsync<Object>(query, parameters);

            return (data.AsList(), "Project tasks retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving Project tasks: {ex.Message}");
        }
    }
}
