using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Status;

public class GetTaskStatuses
{
    private readonly string _connectionString;

    private const String query = @"SELECT 
    TaskStatusId ,Code ,Description ,IsFinal
     FROM core.TaskStatuses";

    public GetTaskStatuses(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> TaskStatuses, string Message)> GetTaskStatusesAsync()
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var data = await db.QueryAsync<Object>(query);
            return (data.AsList(), "TaskStatuses retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving TaskStatuses: {ex.Message}");
        }
    }
}