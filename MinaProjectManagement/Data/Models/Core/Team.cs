using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class Team
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }
        public ICollection<TeamProject> Projects { get; set; }
        public ICollection<TeamMember> TeamMembers { get; set; }
    }
}
