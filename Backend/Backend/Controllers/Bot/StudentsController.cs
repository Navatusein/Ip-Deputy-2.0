using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Buffers.Text;

namespace Backend.Controllers.Bot
{
    [Route("api/bot/students")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<StudentsController>();
        private readonly IConfiguration _config;
        private readonly IpDeputyDbContext _context;

        public StudentsController(IConfiguration config, IpDeputyDbContext context)
        {
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
                _logger.Here().Verbose("Start (telegramId:{@param1})", telegramId);
                StudentWithTelegram? telegram = await _context.StudentWithTelegram
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                {
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                Student student = new Student { Id = telegram.StudentId, LastActivity = DateTime.UtcNow };

                _context.Students.Attach(student);
                _context.Entry(student).Property(x => x.LastActivity).IsModified = true;
                await _context.SaveChangesAsync();

                _logger.Here().Verbose("Result (Ok)");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
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
                _logger.Here().Verbose("Start (telegramId:{@param1})", telegramId);
                StudentWithTelegram? telegram = await _context.StudentWithTelegram
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                {
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                _logger.Here().Verbose("Result ({@param1})", telegram.Language);
                return Ok(telegram.Language);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
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
                _logger.Here().Verbose("Start (dto:{@param1})", dto);
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == dto.TelegramId);

                if (telegram == null)
                {
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                telegram.Language = dto.Language;

                _context.Update(telegram);
                await _context.SaveChangesAsync();

                _logger.Here().Verbose("Result (Ok)");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
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
                _logger.Here().Verbose("Start (telegramId:{@param1})", telegramId);
                StudentWithTelegram? telegram = await _context.StudentWithTelegram
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                {
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                _logger.Here().Verbose("Result ({@param1})", telegram.ScheduleCompact);
                return Ok(telegram.ScheduleCompact);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
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
                _logger.Here().Verbose("Start (dto:{@param1})", dto);
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == dto.TelegramId);

                if (telegram == null)
                {
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                telegram.ScheduleCompact = dto.ScheduleCompact;

                _context.Update(telegram);
                await _context.SaveChangesAsync();

                _logger.Here().Verbose("Result (Ok)");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
