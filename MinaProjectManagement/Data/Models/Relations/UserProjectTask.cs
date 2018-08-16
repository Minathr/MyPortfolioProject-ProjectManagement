using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class UserProjectTask
    {
        public long Id { get; set; }
        public User User { get; set; }

        [Required]
        public long UserId { get; set; }
        public ProjectTask ProjectTask { get; set; }

        [Required]
        public long ProjectTaskId { get; set; }
    }
}
