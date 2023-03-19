using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Bot
{
    [Route("api/bot/students")]
    [ApiController]
    public class StudentsBotController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly IpDeputyDbContext _context;

        public StudentsBotController(ILogger<StudentsBotController> logger, IConfiguration config, IpDeputyDbContext context)
        {
            _logger = logger;
            _config = config;
            _context = context;
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("update-last-activity")]
        [HttpGet]
        public async Task<ActionResult> UpdateLastActivity(int telegramId)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();

                Student student = telegram.Student;
                student.LastActivity = DateTime.Now;

                _context.Update(student);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("language")]
        [HttpGet]
        public async Task<ActionResult<string>> GetLanguage(int telegramId)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();

                return Ok(telegram.Language);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("language")]
        [HttpPost]
        public async Task<ActionResult<string>> UpdateLanguage(LanguageDataDto dto)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == dto.TelegramId);

                if (telegram == null)
                    return Unauthorized();

                telegram.Language = dto.Language;

                _context.Update(telegram);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("schedule")]
        [HttpGet]
        public async Task<ActionResult<bool>> GetScheduleFormat(int telegramId)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();

                return Ok(telegram.ScheduleCompact);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("schedule")]
        [HttpPost]
        public async Task<ActionResult<string>> UpdateScheduleFormat(ScheduleFormatDto dto)
        {
            try
            {
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == dto.TelegramId);

                if (telegram == null)
                    return Unauthorized();

                telegram.ScheduleCompact = dto.ScheduleCompact;

                _context.Update(telegram);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
