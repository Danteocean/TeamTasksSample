using CoreLibrary.Interface.Repositories;
using Domain.Entities;
using infrastructure.Repositories.RepositoryAsync;
using infrastructure.Setting;
using Microsoft.EntityFrameworkCore.Storage;

namespace infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ServiceContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(ServiceContext context) => _context = context;


    IGenericRepository<TaskPriorities> IUnitOfWork.TaskPrioritiesAsync => new TaskPrioritiesRepositoryAsync(_context);

    IGenericRepository<ProjectStatuses> IUnitOfWork.ProjectStatusesAsync => new ProjectStatusesRepositoryAsync(_context);

    IGenericRepository<Developers> IUnitOfWork.DevelopersAsync => new DevelopersRepositoryAsync(_context);

    IGenericRepository<TaskStatuses> IUnitOfWork.TaskStatusesAsync => new TaskStatusesRepositoryAsync(_context);

    IGenericRepository<Domain.Entities.Task> IUnitOfWork.TaskAsync => new TaskRepositoryAsync(_context);

    IGenericRepository<Projects> IUnitOfWork.ProjectsAsync => new ProjectsRepositoryAsync(_context);

    public async System.Threading.Tasks.Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false);
    }

    public async System.Threading.Tasks.Task CommitnAsync()
    {
        try
        {
            await BeginTransactionAsync();
            await _context.SaveChangesAsync();
            await _transaction!.CommitAsync();
        }
        catch
        {
            await RollbackAsync();
            throw;
        }
        finally
        {
            _transaction?.Dispose();
            Dispose();
        }
    }

    private bool disposed = false;

    private void Dispose(bool disposing)
    {
        if (!disposed)
        {
            if (disposing)
            {
                _context.Dispose();
            }
        }

        disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public System.Threading.Tasks.Task RollbackAsync()
    {
        _transaction?.Rollback();
        _transaction?.Dispose();
        return System.Threading.Tasks.Task.CompletedTask;
    }
}