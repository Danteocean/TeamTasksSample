using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class TaskStatusesRepositoryAsync : GenericRepository<TaskStatuses>
{
    public TaskStatusesRepositoryAsync(ServiceContext microServiceContext) : base(microServiceContext) { }
}