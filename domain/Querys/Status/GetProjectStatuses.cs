using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Status;

public class GetProjectStatuses
{
    private readonly string _connectionString;

    private const String query = @"SELECT 
    ProjectStatusId ,Code ,Description FROM core.ProjectStatuses WHERE IsActive = 1";

    public GetProjectStatuses(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> ProjectStatuses, string Message)> GetProjectStatusesAsync()
    {
        try
        {

            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "ProjectStatuses retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving ProjectStatuses: {ex.Message}");
        }
    }
}
