using Dapper;
using Domain.Entities;
using Microsoft.Data.SqlClient;
using System.Data;

public class UpdateTask
{
    private readonly string _connectionString;

    private const String query = @"
    EXEC core.usp_UpdateTaskStatus
    @TaskId = @TaskId,
    @TaskStatusId = @TaskStatusId,
    @TaskPriorityId = @TaskPriorityId,
    @EstimatedComplexity = @EstimatedComplexity,
    @UpdatedBy = @UpdatedBy;";

    public UpdateTask(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(UpdateTaskResult tasks, string Message)> UpdateTasksAsync(int id ,
     Domain.Entities.Task task)
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var parameters = new
            {
                TaskId = id,
                TaskStatusId = task.TaskStatusId,
                TaskPriorityId = task.TaskPriorityId,
                EstimatedComplexity = task.EstimatedComplexity,
                UpdatedBy = task.UpdatedBy,
            };

            var data = await db.QuerySingleOrDefaultAsync<UpdateTaskResult>(query, parameters)
            ?? new UpdateTaskResult();

            return (data, "Task update successfully.");
        }
        catch (Exception ex)
        {
            return (new UpdateTaskResult(), $"Error retrieving Task: {ex.Message}");
        }
    }
}