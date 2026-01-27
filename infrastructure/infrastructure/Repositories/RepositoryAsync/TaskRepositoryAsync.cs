using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class TaskRepositoryAsync : GenericRepository<Domain.Entities.Task>
{
    public TaskRepositoryAsync(ServiceContext microServiceContext) : base(microServiceContext) { }
}