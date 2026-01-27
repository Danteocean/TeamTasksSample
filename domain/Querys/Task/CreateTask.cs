using Dapper;
using Domain.Entities;
using Microsoft.Data.SqlClient;
using System.Data;

public class CreateTask
{
    private readonly string _connectionString;

    private const String query = @"
    EXEC core.usp_CreateTask @ProjectId = @ProjectId ,@Title = @Title,
    @Description = @Description ,@AssigneeId = @AssigneeId ,@TaskStatusId = @TaskStatusId ,
    @TaskPriorityId = @TaskPriorityId ,@EstimatedComplexity = @EstimatedComplexity ,
    @DueDate =  @DueDate ,@CreatedBy = @CreatedBy;";

    public CreateTask(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(CreateTaskResult tasks, string Message)> AddTasksAsync(
     Domain.Entities.Task task)
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var parameters = new
            {
                ProjectId = task.ProjectId,
                Title = task.Title,
                Description = task.Description,
                AssigneeId = task.AssigneeId,
                TaskStatusId = task.TaskStatusId,
                TaskPriorityId = task.TaskPriorityId,
                EstimatedComplexity = task.EstimatedComplexity,
                DueDate = task.DueDate,
                CreatedBy = task.CreatedBy
            };

            var data = await db.QuerySingleOrDefaultAsync<CreateTaskResult>(query, parameters)
            ?? new CreateTaskResult();

            return (data, "Task created successfully.");
        }
        catch (Exception ex)
        {
            return (new CreateTaskResult(), $"Error retrieving Task: {ex.Message}");
        }
    }
}