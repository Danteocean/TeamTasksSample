using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("TaskPriorities")]
public class TaskPriorities
{
    [Key]
    public int TaskPriorityId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public int Level { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }
}