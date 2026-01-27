using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.Setting;

public class ServiceContext: DbContext
{
    public ServiceContext(DbContextOptions<ServiceContext> options):base(options)
    {
    }

    public DbSet<Domain.Entities.Task> tasks => Set<Domain.Entities.Task>();
    public DbSet<Developers> developers => Set<Developers>();
    public DbSet<Projects> projects => Set<Projects>();
    public DbSet<ProjectStatuses> projectStatuses => Set<ProjectStatuses>();
    public DbSet<TaskPriorities> taskPriorities => Set<TaskPriorities>();
    public DbSet<TaskStatuses> taskStatuses => Set<TaskStatuses>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Domain.Entities.Task>();
        modelBuilder.Entity<Developers>();
        modelBuilder.Entity<Projects>();
        modelBuilder.Entity<ProjectStatuses>();
        modelBuilder.Entity<TaskPriorities>();
        modelBuilder.Entity<TaskStatuses>();
        
    }
}