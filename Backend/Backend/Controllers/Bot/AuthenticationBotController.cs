using AutoMapper;
using Backend.Controllers.Frontend;
using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.DtoModels.Frontend;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Controllers.Bot
{
    [Route("api/bot/authentication")]
    [ApiController]
    public class AuthenticationBotController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly IpDeputyDbContext _context;

        public AuthenticationBotController(ILogger<AuthenticationBotController> logger, IConfiguration config, IpDeputyDbContext context)
        {
            _logger = logger;
            _config = config;
            _context = context;
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult<string>> Login(StudentLoginDto loginData)
        {
            try
            {
                Student? student = await _context.Students.FirstOrDefaultAsync(x => x.TelegramPhone == loginData.TelegramPhone);

                if (student == null)
                    return Unauthorized("No such student");

                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == loginData.TelegramId);

                if (telegram == null)
                {
                    telegram = new StudentWithTelegram()
                    {
                        StudentId = student.Id,
                        TelegramId = loginData.TelegramId,
                        Language = "uk",
                        ScheduleCompact = false,
                    };

                    await _context.AddAsync(telegram);
                    await _context.SaveChangesAsync();
                }

                return Ok("Successfully logined");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("authorized")]
        [HttpGet]
        public async Task<ActionResult> Authorized(int telegramId)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();


                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("is-admin")]
        [HttpGet]
        public async Task<ActionResult<bool>> IsAdmin(int telegramId)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();

                if (telegram.Student.WebAdminAuth == null)
                    return Ok(false);

                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("frontend-token")]
        [HttpGet]
        public async Task<ActionResult<string>> GetFrontendToken(int telegramId)
        {
            try
            {
                Student? student = await _context.Students.FirstOrDefaultAsync(x => x.StudentWithTelegram!.TelegramId == telegramId);

                if (student == null)
                    return Unauthorized();

                string token = GetAuthorizeJwt(student.Id);

                UserDataDto userDataDto = new();

                userDataDto.StudentId = student.Id;
                userDataDto.UserName = student.Name;
                userDataDto.JwtToken = GetAuthorizeJwt(student.Id);

                string json = JsonSerializer.Serialize(userDataDto);

                string base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));

                return Ok(base64);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        private string GetAuthorizeJwt(int studentId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["FrontendAuthorizeJWT:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", studentId.ToString()),
                new Claim("refresh", "false")
            };

            var token = new JwtSecurityToken(_config["FrontendAuthorizeJWT:Issuer"],
                _config["FrontendAuthorizeJWT:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
