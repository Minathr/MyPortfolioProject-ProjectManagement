using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class User: IdentityUser<long>
    {
        [Required]
        public string Name { get; set; }
        public bool IsAdmin { get; set; }
        public Team CurrentTeam { get; set; }
        public long? CurrentTeamId { get; set; }
        public ICollection<ProjectTask> Tasks { get; set; }
    }
}
