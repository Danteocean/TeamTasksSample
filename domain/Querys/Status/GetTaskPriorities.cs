using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Status;

public class GetTaskPriorities
{
    private readonly string _connectionString;

    private const String query = @"SELECT 
    TaskPriorityId ,Code ,Description ,Level
     FROM core.TaskPriorities";

    public GetTaskPriorities(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> TaskPriorities, string Message)> GetTaskPrioritiesAsync()
    {
        try
        {

            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "TaskPriorities retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving TaskPriorities: {ex.Message}");
        }
    }
}
