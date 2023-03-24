using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels;
using Backend.DtoModels.Bot;
using Backend.DtoModels.Frontend;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Serilog.Context;
using Serilog;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Controllers.Frontend
{
    [Route("api/frontend/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<AuthenticationController>();
        private readonly IConfiguration _config;
        private readonly IpDeputyDbContext _context;

        public AuthenticationController(IConfiguration config, IpDeputyDbContext context)
        {
            _config = config;
            _context = context;
        }

        [AllowAnonymous]
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult<UserDataDto>> FrontendLogin(LoginDataDto loginData)
        {
            try
            {
                WebAdminAuth? webAdminAuth = await _context.WebAdminAuths.Where(x => x.Login == loginData.Login.ToLower()).FirstOrDefaultAsync();

                if (webAdminAuth == null)
                    return BadRequest("Invalid user login or password");

                if (webAdminAuth.VerifyPasswordHash(loginData.Password.ToLower()))
                    return BadRequest("Invalid user login or password");

                Student student = webAdminAuth.Student;

                UserDataDto userDataDto = GetFrontendUserDataDto(student);

                return Ok(userDataDto);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [AllowAnonymous]
        [Route("refresh")]
        [HttpPost]
        public async Task<ActionResult<UserDataDto>> FrontendRefresh(UserDataDto userDataDto)
        {
            try
            {
                var refreshToken = Request.Cookies["RefreshToken"];

                if (refreshToken == null)
                    return BadRequest("Invalid refresh token");

                if (!ValidateRefreshJwt(refreshToken, userDataDto.StudentId))
                    return BadRequest("Invalid refresh token");

                Student? student = await _context.Students.FirstOrDefaultAsync(x => x.Id == userDataDto.StudentId);

                if (student == null)
                    return BadRequest("Invalid user data");

                userDataDto = GetFrontendUserDataDto(student);

                return Ok(userDataDto);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [AllowAnonymous]
        [Route("password")]
        [HttpGet]
        public ActionResult<Dictionary<string, string>> GenetatePassword(string password)
        {
            try
            {
                Dictionary<string, string> passwordData = new();

                using (var hmac = new HMACSHA512())
                {
                    passwordData["Hash"] = Convert.ToBase64String(hmac.Key);
                    passwordData["Salt"] = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password.ToLower())));
                }

                return passwordData;
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        private UserDataDto GetFrontendUserDataDto(Student student)
        {
            UserDataDto userDataDto = new();

            userDataDto.StudentId = student.Id;
            userDataDto.UserName = student.Name;
            userDataDto.JwtToken = GetAuthorizeJwt(student.Id);

            var refreshToken = GetRefreshJwt(student.Id);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc).AddDays(30),
                Secure = true,
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

            return userDataDto;
        }

        private string GetAuthorizeJwt(int studentId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FrontendAuthorizeJWT:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", studentId.ToString()),
                new Claim("refresh", "true")
            };

            var token = new JwtSecurityToken(_config["FrontendAuthorizeJWT:Issuer"],
                _config["FrontendAuthorizeJWT:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GetRefreshJwt(int studentId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FrontendRefreshJWT:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", studentId.ToString())
            };

            var token = new JwtSecurityToken(_config["FrontendRefreshJWT:Issuer"],
                _config["FrontendRefreshJWT:Audience"],
                claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool ValidateRefreshJwt(string token, int studentId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["FrontendRefreshJWT:Issuer"],
                ValidAudience = _config["FrontendRefreshJWT:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FrontendRefreshJWT:Key"]!))
            };

            if (tokenHandler.CanReadToken(token))
            {
                try
                {
                    ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                    if (principal.HasClaim(c => c.Type == "id"))
                    {
                        int id = Convert.ToInt32(principal.Claims.Where(c => c.Type == "id").First().Value);

                        return studentId == id;
                    }
                }
                catch (Exception ex)
                {
                    _logger.Here().Error(ex, "");
                }
            }

            return false;
        }
    }
}
