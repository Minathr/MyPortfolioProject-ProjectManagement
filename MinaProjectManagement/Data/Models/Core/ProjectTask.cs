using Mina.ProjectManagement.Data.Models.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class ProjectTask
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDateTime { get; set; }
        public Project Project { get; set; }
        public long ProjectId { get; set; }
        public ProjectTaskStatus ProjectTaskStatus { get; set; }
        public User Assignee { get; set; }
        public long AssigneeId { get; set; }
    }
}
