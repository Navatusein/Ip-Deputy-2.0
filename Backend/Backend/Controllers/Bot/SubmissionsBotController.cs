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
    public class SubmissionsBotController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubmissionsBotController(ILogger<SubmissionsBotController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
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
                StudentWithTelegram? telegram = await _context.StudentWithTelegram.FirstOrDefaultAsync(x => x.TelegramId == telegramId);

                if (telegram == null)
                    return Unauthorized();

                List<SubmisionInfoDto> dtos = await _context.SubmissionConfigs
                    .Where(x => x.SubmissionWithGroups.Any(y => y.GroupId == telegram.Student.GroupId) && (x.SubgroupId == null || x.SubgroupId == telegram.Student.SubgroupId))
                    .Select(x => new SubmisionInfoDto()
                    {
                        Id = x.Id,
                        Name = $"{(x.Subject.ShortName != null ? x.Subject.ShortName : x.Subject.Name)} {x.SubjectType.ShortName}",
                        Type = x.SubjectType.ShortName
                    })
                    .ToListAsync();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
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
                SubmissionConfig? submissionConfig = await _context.SubmissionConfigs.FirstOrDefaultAsync(x => x.Id == submissionConfigId);

                if (submissionConfig == null)
                    return BadRequest("Invalid submission config id");

                Dictionary<string, List<string>> submissionStudents = new Dictionary<string, List<string>>();

                foreach (var submission in submissionConfig.Submissions.OrderBy(x => x.SubmissionWork.Name))
                {
                    string studentName = $"{submission.Student.Surname} {submission.Student.Name}";

                    if (!submissionStudents.Keys.Contains(studentName))
                        submissionStudents.Add(studentName, new List<string>());

                    submissionStudents[studentName].Add(submission.SubmissionWork.Name);
                }

                return Ok(submissionStudents);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
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
                if (_context.SubmissionConfigs.All(x => x.Id != submissionConfigId))
                    return BadRequest("Invalid submission config id");

                _context.Submissions.RemoveRange(await _context.Submissions.Where(x => x.SubmissionConfigId == submissionConfigId).ToListAsync());
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
