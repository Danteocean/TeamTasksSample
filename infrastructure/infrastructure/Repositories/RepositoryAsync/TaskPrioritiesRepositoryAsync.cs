using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class TaskPrioritiesRepositoryAsync : GenericRepository<TaskPriorities>
{
    public TaskPrioritiesRepositoryAsync(ServiceContext ServiceContext) : base(ServiceContext) { }
}
