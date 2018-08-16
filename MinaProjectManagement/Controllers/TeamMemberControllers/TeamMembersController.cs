using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mina.ProjectManagement.Data.DataContext;
using Mina.ProjectManagement.Data.Models;

namespace MinaProjectManagement.Controllers.TeamMemberControllers
{
    [Authorize]
    [Route("api/member")]
    public class TeamMemberController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ProjectManagementDbContext _dbContext;
        public TeamMemberController(ProjectManagementDbContext dbContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("mytasks")]
        public async Task<IActionResult> GetMyTasks()
        {
            var userId = long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var tasks = await _dbContext
                .ProjectTasks
                .Where(q=>q.AssigneeId==userId)
                .Select(q=>new
                {
                    q.Id,
                    q.Name,
                    q.Project,
                    q.ProjectTaskStatus,
                    q.Description,
                    q.DueDateTime
                })
                .ToArrayAsync();

            return Json(tasks);
        }

        [HttpPut]
        [Route("tasks/{projectTaskId}")]
        public async Task<IActionResult> EditProjectTask(long projectTaskId,[FromBody] ProjectTask projectTask)
        {
            var oldProjectTask = await _dbContext.ProjectTasks.SingleAsync(q=>q.Id==projectTaskId);
            oldProjectTask.ProjectTaskStatus = projectTask.ProjectTaskStatus;
            oldProjectTask.Description = projectTask.Description;

            await _dbContext.SaveChangesAsync();
            return NoContent();

        }
    }
}