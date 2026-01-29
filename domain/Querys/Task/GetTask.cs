using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Task;

public   class GetTask
{
    private readonly string _connectionString;

    private const String query = @"SELECT TaskId
    ,ProjectId ,Title ,Description ,AssigneeId
    ,TaskStatusId ,TaskPriorityId ,EstimatedComplexity
    ,DueDate ,CompletionDate
    FROM core.Tasks
    WHERE TaskStatusId <> 4";

    public GetTask(string connection)
    {
        _connectionString = connection;
    }

    public async Task<(List<Object> Task, string Message)> GetTaskAsync()
    {
        try
        {

            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "Task retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving Task: {ex.Message}");
        }
    }
}