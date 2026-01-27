using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("Tasks")]
public class Task
{

    [Key]
    public int TaskId { get; set; }

    public int ProjectId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int AssigneeId { get; set; }

    public int TaskStatusId { get; set; }

    public int TaskPriorityId { get; set; }

    public int EstimatedComplexity { get; set; }

    public DateTime DueDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }
}