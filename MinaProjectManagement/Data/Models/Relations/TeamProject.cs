using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class TeamProject
    {
        public long Id { get; set; }

        [Required]
        public Project Project { get; set; }
        public long ProjectId { get; set; }
        public Team Team { get; set; }

        [Required]
        public long TeamId { get; set; }
        public bool IsValid { get; set; }

        public DateTime AssignDate { get; set; }
        public DateTime? UnAssignDate { get; set; }
    }
}
