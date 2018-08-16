using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class TeamMember
    {
        public long Id { get; set; }
        public Team Team { get; set; }

        [Required]
        public long TeamId { get; set; }
        public User User { get; set; }

        [Required]
        public long UserId { get; set; }
        public bool IsValid { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LeftDate { get; set; }
    }
}
