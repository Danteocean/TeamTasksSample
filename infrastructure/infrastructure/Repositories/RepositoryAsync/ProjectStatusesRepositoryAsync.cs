using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class ProjectStatusesRepositoryAsync : GenericRepository<ProjectStatuses>
{
    public ProjectStatusesRepositoryAsync(ServiceContext ServiceContext) : base(ServiceContext) { }
}
