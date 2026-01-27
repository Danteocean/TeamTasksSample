using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;
using Domain.Entities;

public class GetProjectTasks
{
    private readonly string _connectionString;

    private const String query = @"
    EXEC core.usp_GetProjectTasks @ProjectId = @ProjectId ,@StatusCode = @StatusCode,
     @AssigneeId = @AssigneeId, @Page = @Page,@PageSize = @PageSize;";

    public GetProjectTasks(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> projectTasks, string Message)> GetProjectTasksAsync(
     ProjectTasksFilterRequest projectTasksFilterRequest)
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var parameters = new
            {
                ProjectId = projectTasksFilterRequest.ProjectId,
                StatusCode = projectTasksFilterRequest.StatusCode,
                AssigneeId = projectTasksFilterRequest.AssigneeId,
                Page = projectTasksFilterRequest.Page,
                PageSize = projectTasksFilterRequest.PageSize
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
