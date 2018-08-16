using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mina.ProjectManagement.Data.Models;
using Mina.ProjectManagement.Data.Models.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mina.ProjectManagement.Data.DataContext
{
    public class ProjectManagementDbContext : IdentityDbContext<User,Role,long>
    {
        public ProjectManagementDbContext(DbContextOptions<ProjectManagementDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<TeamProject> TeamProjects { get; set; }
    }
}
