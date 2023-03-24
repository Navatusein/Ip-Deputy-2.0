using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using System.Xml.Linq;

namespace Backend.Controllers.Bot
{
    [Route("api/bot/submissions")]
    [ApiController]
    public class SubmissionsController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<SubmissionsController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubmissionsController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("get-submissions-info")]
        [HttpGet]
        public async Task<ActionResult> GetSubmissionInfos(int telegramId)
        {
            try
            {
                _logger.Here().Verbose("Start (telegramId:{@param1})", telegramId);

                StudentWithTelegram? telegram = await _context.StudentWithTelegram
                    .FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null){
                    _logger.Here().Verbose("Result (Unauthorized)");
                    return Unauthorized();
                }

                List<SubmisionInfoDto> dtos = await _context.SubmissionConfigs
                    .AsNoTracking()
                    .Where(x => x.SubmissionWithGroups.Any(y => y.GroupId == telegram.Student.GroupId) && (x.SubgroupId == null || x.SubgroupId == telegram.Student.SubgroupId))
                    .Select(x => new SubmisionInfoDto()
                    {
                        Id = x.Id,
                        Name = $"{(x.Subject.ShortName != null ? x.Subject.ShortName : x.Subject.Name)} {x.SubjectType.ShortName}",
                        Type = x.SubjectType.ShortName
                    })
                    .ToListAsync();

                _logger.Here().Verbose("Result ({@param1})", dtos);
                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("get-submission-students")]
        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<string>>>> GetSubmissionStudents(int submissionConfigId)
        {
            try
            {
                _logger.Here().Verbose("Start (submissionConfigId:{@param1})", submissionConfigId);

                SubmissionConfig? submissionConfig = await _context.SubmissionConfigs
                    .FirstOrDefaultAsync(x => x.Id == submissionConfigId);

                if (submissionConfig == null)
                {
                    _logger.Here().Verbose("Result (Invalid submission config id)");
                    return BadRequest("Invalid submission config id");
                }

                Dictionary<string, List<string>> submissionStudents = new Dictionary<string, List<string>>();

                foreach (var submission in submissionConfig.Submissions.OrderBy(x => x.Id).OrderBy(x => x.SubmissionWork.Name))
                {
                    string studentName = $"{submission.Student.Surname} {submission.Student.Name}";

                    if (!submissionStudents.Keys.Contains(studentName))
                        submissionStudents.Add(studentName, new List<string>());

                    submissionStudents[studentName].Add(submission.SubmissionWork.Name);
                }

                _logger.Here().Verbose("Result ({@param1})", submissionStudents);
                return Ok(submissionStudents);

            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(AuthenticationSchemes = BotAuthenticationSchemeOptions.DefaultScemeName)]
        [Route("clear-submission-students")]
        [HttpDelete]
        public async Task<ActionResult> ClearSubmission(int submissionConfigId)
        {
            try
            {
                _logger.Here().Verbose("Start (submissionConfigId:{@param1})", submissionConfigId);

                if (_context.SubmissionConfigs.All(x => x.Id != submissionConfigId))
                {
                    _logger.Here().Verbose("Result (Invalid submission config id)");
                    return BadRequest("Invalid submission config id");
                };

                _context.Submissions.RemoveRange(await _context.Submissions.Where(x => x.SubmissionConfigId == submissionConfigId).ToListAsync());
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
