using Domain.Entities;
using infrastructure.Setting;

namespace infrastructure.Repositories.RepositoryAsync;

public class DevelopersRepositoryAsync : GenericRepository<Developers>
{
    public DevelopersRepositoryAsync(ServiceContext microServiceContext) : base(microServiceContext) { }
}