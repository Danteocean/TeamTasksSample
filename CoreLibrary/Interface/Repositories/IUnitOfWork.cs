using Domain.Entities;

namespace CoreLibrary.Interface.Repositories;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Domain.Entities.Task> TaskAsync { get; }
    IGenericRepository<Developers> DevelopersAsync { get; }

    IGenericRepository<Projects> ProjectsAsync { get; }

    IGenericRepository<ProjectStatuses> ProjectStatusesAsync { get; }

    IGenericRepository<TaskPriorities> TaskPrioritiesAsync { get; }

    IGenericRepository<TaskStatuses> TaskStatusesAsync { get; }

    System.Threading.Tasks.Task BeginTransactionAsync();

    System.Threading.Tasks.Task CommitnAsync();

    System.Threading.Tasks.Task RollbackAsync();
}