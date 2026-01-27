using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class ProjectsRepositoryAsync : GenericRepository<Projects>
{
    public ProjectsRepositoryAsync(ServiceContext microServiceContext) : base(microServiceContext) { }
}