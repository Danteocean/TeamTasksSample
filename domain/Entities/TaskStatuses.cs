using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("TaskStatuses")]
public class TaskStatuses
{
    [Key]
    public int TaskStatusId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public bool IsFinal { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }
}