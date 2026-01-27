using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Domain.Querys.Developer;

public class GetDeveloper
{
    private readonly string _connectionString;

    private const String query = @"
    SELECT DeveloperId ,FirstName ,LastName ,Email FROM core.Developers WHERE [IsActive] = 1";

    public GetDeveloper(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<(List<Object> developer, string Message)> GetDeveloperAsync()
    {
        try
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var data = await db.QueryAsync<Object>(query);

            return (data.AsList(), "Developer  retrieved successfully.");
        }
        catch (Exception ex)
        {
            return (new List<Object>(), $"Error retrieving Project developer : {ex.Message}");
        }
    }
}