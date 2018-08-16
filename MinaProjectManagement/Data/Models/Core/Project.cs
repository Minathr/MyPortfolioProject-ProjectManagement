using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.Models
{
    public class Project
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime BeginDateTime { get; set; }
        public DateTime FinishDateTime { get; set; }
        public Team CurrentTeam { get; set; }
        public long? CurrentTeamId { get; set; }
    }
}
