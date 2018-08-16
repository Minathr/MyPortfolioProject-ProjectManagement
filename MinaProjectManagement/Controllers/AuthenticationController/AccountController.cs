using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Mina.ProjectManagement.Data.DataContext;
using Mina.ProjectManagement.Data.Models;
using Mina.ProjectManagement.ViewModels.Input;

namespace MinaProjectManagement.Controllers
{
    [Route("api/auth")]
    public class AccountController : Controller
    {
        private readonly ProjectManagementDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(
                   UserManager<User> userManager,
                   SignInManager<User> signInManager,
                   ProjectManagementDbContext dbContext)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
        }


        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]LoginInputViewModel viewModel)
        {
            var result = await _signInManager.PasswordSignInAsync(viewModel.UserName,
                viewModel.Password,isPersistent:true, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                return Ok(new { Value = await GenerateJwtTokenAsync(viewModel.UserName)});
            }
            if (result.RequiresTwoFactor)
            {
                
            }
            if (result.IsLockedOut)
            {

            }
            else
            {

            }

            return BadRequest("Could not verify username and password");
        }

        private async Task<string> GenerateJwtTokenAsync(string userName)
        {
            var user = await _userManager.FindByEmailAsync(userName);
            var roles = await _userManager.GetRolesAsync(user);

            // just for the first time
            if (user.Email == "mina9@mina.com")
            {
                user.IsAdmin = true;
                await _dbContext.SaveChangesAsync();
            }

            var claims = new[]
            {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim("UserId", user.Id.ToString()),
                    (user.IsAdmin) 
                    ?new Claim(ClaimTypes.Role, "admin")
                    :new Claim(ClaimTypes.Role, "member")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("M!nAAzManBehtanNist!!!!ValiManKharamUnKharTa@re"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "M!nA",
                audience: "M!nA",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            var stringToken = new JwtSecurityTokenHandler().WriteToken(token);

            return stringToken;
        }

        [HttpPost]
        [Route("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> Signup([FromBody]SignupInputViewModel viewModel)
        {
            var user = new User
            {
                UserName = viewModel.Email,
                Email = viewModel.Email,
                Name= viewModel.Name
            };
            var result = await _userManager.CreateAsync(user, viewModel.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { Value = await GenerateJwtTokenAsync(viewModel.Email) });
            }

            return BadRequest();
        }
    }
}