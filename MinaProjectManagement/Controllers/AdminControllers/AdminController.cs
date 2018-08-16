using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mina.ProjectManagement.Data.DataContext;
using Mina.ProjectManagement.Data.Models;


namespace MinaProjectManagement.Controllers.AdminControllers
{
    [Authorize]
    [Route("api/admin")]
    public class AdminController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ProjectManagementDbContext _dbContext;
        public AdminController(ProjectManagementDbContext dbContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("projects")]
        public async Task<IActionResult> ShowProjects()
        {
            var projects= await _dbContext.Projects.ToArrayAsync().ConfigureAwait(false);
            return Json(projects);
        }

        [HttpPost]
        [Route("projects")]
        public async Task<IActionResult> DefineNewProject([FromBody]Project project)
        {
            _dbContext.Projects.Add(project);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("projects")]
        public async Task<IActionResult> EditProject([FromBody]Project project)
        {
            _dbContext.Update(project);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("teams")]
        public async Task<IActionResult> ShowTeams()
        {
            var teams = await _dbContext.Teams.ToArrayAsync().ConfigureAwait(false);
            return Json(teams);
        }

        [HttpPost]
        [Route("teams")]
        public async Task<IActionResult> DefineNewTeam([FromBody]Team team)
        {
            _dbContext.Add(team);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("teams")]
        public async Task<IActionResult> EditTeams([FromBody]Team team)
        {
            _dbContext.Update(team);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> ShowUsers()
        {
            var users = await _userManager.Users
                .Select(q=> new
                {                
                    TeamName= q.CurrentTeam.Name,
                    q.Name,
                    q.Email,
                    q.Id,
                    q.UserName,
                    q.PhoneNumber,
                    q.IsAdmin
                })
                .ToArrayAsync();

            return Json(users);
        }

        [HttpPut]
        [Route("users")]
        public async Task<IActionResult> EditUser([FromBody]User user)
        {
            var oldUser = await _dbContext.Users.SingleAsync(q=>q.Id==user.Id);
            oldUser.Name = user.Name;
            oldUser.PhoneNumber= user.PhoneNumber;
            oldUser.IsAdmin = user.IsAdmin;
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("teams/{teamId}")]
        public async Task<IActionResult> GetTeamDetail(long teamId)
        {
            var team = await _dbContext.Teams.SingleAsync(q=>q.Id==teamId);

            var members = await _dbContext.TeamMembers
                .Include(q=>q.User)
                .Where(q => q.IsValid && q.TeamId == teamId)
                .Select(q=> q.User)
                .ToArrayAsync();

            var projects = await _dbContext.TeamProjects
                .Include(q => q.Project)
                .Where(q => q.IsValid && q.TeamId == teamId)
                .Select(q => q.Project)
                .ToArrayAsync();

            return Json(new
            {
                team.Id,
                team.Name,
                Members =members,
                Projects = projects
            });
        }

        [HttpGet]
        [Route("users/without-team")]
        public async Task<IActionResult> GetUsersWithoutTeam()
        {
            var users = await _dbContext.Users
                .Where(q => q.CurrentTeamId == null)
                .ToArrayAsync();

            return Json(users);
        }

        [HttpGet]
        [Route("projects/without-team")]
        public async Task<IActionResult> GetProjectsWithoutTeam()
        {
            var projects = await _dbContext.Projects
                .Where(q => q.CurrentTeamId == null)
                .ToArrayAsync();

            return Json(projects);
        }

        [HttpPost]
        [Route("teams/{teamId}/assign/{memberId}")]
        public async Task<IActionResult> AssignNewMemberToTeam(long teamId,long memberId)
        {
            var oldTeamMember = await _dbContext.TeamMembers.SingleOrDefaultAsync
                (q => q.IsValid && q.UserId == memberId);

            var user = await _dbContext.Users.SingleAsync(q => q.Id == memberId);
            user.CurrentTeamId = teamId;

            if (oldTeamMember != null)
            {
                oldTeamMember.IsValid = false;
                oldTeamMember.LeftDate = DateTime.Now;
            }
                
            var newTeamMember = new TeamMember()
            {
                IsValid=true,
                JoinDate=DateTime.Now,
                TeamId=teamId,
                UserId=memberId
            };

            _dbContext.Add(newTeamMember);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("teams/{teamId}/commit/{projectId}")]
        public async Task<IActionResult> AssignNewProjectToTeam(long teamId, long projectId)
        {
            var oldTeamProject = await _dbContext.TeamProjects.SingleOrDefaultAsync
                (q => q.IsValid && q.ProjectId == projectId);

            var user = await _dbContext.Projects.SingleAsync(q => q.Id == projectId);
            user.CurrentTeamId = teamId;

            if (oldTeamProject != null)
            {
                oldTeamProject.IsValid = false;
                oldTeamProject.UnAssignDate = DateTime.Now;
            }

            var newTeamProject = new TeamProject()
            {
                IsValid = true,
                AssignDate = DateTime.Now,
                TeamId = teamId,
                ProjectId = projectId
            };

            _dbContext.Add(newTeamProject);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("teams/{teamId}/members")]
        public async Task<IActionResult> GetTeamMembers(long teamId)
        {
            var teamMembers = await _dbContext.TeamMembers
                .Where(q => q.IsValid && q.TeamId==teamId)
                .Select(q=>q.User)
                .ToArrayAsync();

            return Json(teamMembers);
        }

        [HttpGet]
        [Route("projects/{projectId}")]
        public async Task<IActionResult> GetProjectTasks(long projectId)
        {
            var project = await _dbContext.Projects
                .Include(q=>q.CurrentTeam)
                .SingleAsync(q=>q.Id==projectId);

            var projectTasks = await _dbContext.ProjectTasks
                .Include(q=>q.Assignee)
                .Where(q => q.ProjectId == projectId)
                .Select(q=>new
                {
                    q.Id,
                    q.Name,
                    q.Description,
                    q.DueDateTime,
                    q.ProjectTaskStatus,
                    q.AssigneeId,
                    AssigneeName = q.Assignee.Name,
                })
                .ToArrayAsync();

            return Json(new
            {
                project.Id,
                project.Name,
                Team = project.CurrentTeam,
                Tasks=projectTasks
            });
        }

        [HttpPost]
        [Route("projects/{projectId}/tasks")]
        public async Task<IActionResult> DefineNewProjectTasks(long projectId,[FromBody] ProjectTask task)
        {
            task.ProjectId = projectId;
            task.Project = null;
            task.AssigneeId = task.Assignee.Id;
            task.Assignee = null;
            _dbContext.Add(task);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut]
        [Route("projects/{projectId}/tasks")]
        public async Task<IActionResult> EditProjectTasks(long projectId, [FromBody] ProjectTask task)
        {
            task.ProjectId = projectId;
            _dbContext.Update(task);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}