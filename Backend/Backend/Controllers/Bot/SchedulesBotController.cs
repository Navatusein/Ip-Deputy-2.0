using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Backend.Controllers.Bot
{
    [Route("api/bot/schedules")]
    [ApiController]
    public class SchedulesBotController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SchedulesBotController(ILogger<SchedulesBotController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("day")]
        public async Task<ActionResult<ScheduleDayInfoDto>> GetDaySchedule(int telegramId, string dateString)
        {
            try
            {
                Student? student = await _context.Students.FirstOrDefaultAsync(x => x.StudentWithTelegram!.TelegramId == telegramId);

                if (student == null)
                    return Unauthorized("No such student");

                DateOnly date = DateOnly.Parse(dateString);

                ScheduleDayInfoDto schedule = new ScheduleDayInfoDto();

                schedule.CouplesTimes = await _context.CoupleTimes
                    .Select(x => $"{x.TimeStart} - {x.TimeEnd}")
                    .ToListAsync();

                schedule.Subjects = await GetSubjectsForScheduleInfo(student, date);

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("week")]
        public async Task<ActionResult<ScheduleWeekInfoDto>> GetWeekSchedule(int telegramId, string dateString)
        {
            try
            {
                Student? student = await _context.Students.FirstOrDefaultAsync(x => x.StudentWithTelegram!.TelegramId == telegramId);

                if (student == null)
                    return Unauthorized("No such student");

                DateOnly date = DateOnly.Parse(dateString);
                DateOnly startWeek = date.AddDays(-(date.DayOfWeek == 0 ? 6 : (int)date.DayOfWeek - 1));

                ScheduleWeekInfoDto schedule = new ScheduleWeekInfoDto();

                schedule.CouplesTimes = await _context.CoupleTimes
                    .Select(x => $"{x.TimeStart} - {x.TimeEnd}")
                    .ToListAsync();

                for (int i = 0; i < 7; i++)
                {
                    DateOnly day = startWeek.AddDays(i);

                    schedule.Subjects.Add(day.ToString(), await GetSubjectsForScheduleInfo(student, day));
                }

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task<List<SubjectForScheduleInfoDto>> GetSubjectsForScheduleInfo(Student student, DateOnly date)
        {
            List<SubjectForScheduleInfoDto> subjectForScheduleInfoDtos = new List<SubjectForScheduleInfoDto>();

            List<Schedule> schedules = await _context.Schedules
            .Where(x => x.DayOfWeek.Index == (int)date.DayOfWeek && x.ScheduleWithGroups.Any(y => y.GroupId == student.GroupId))
            .ToListAsync();

            foreach (var schedule in schedules)
            {
                if (schedule.ScheduleAdditionalDates.Any(y => y.Date == date))
                {
                    subjectForScheduleInfoDtos.Add(new SubjectForScheduleInfoDto()
                    {
                        Subject = schedule.Subject.ShortName != null ? schedule.Subject.ShortName : schedule.Subject.Name,
                        SubjectType = schedule.SubjectType.ShortName,
                        CoupleIndex = schedule.CoupleTime.Index - 1,
                        IsMySubgroup = schedule.SubgroupId == null || student.SubgroupId == schedule.SubgroupId,
                        Link = schedule.Link,
                        AdditionalInformation = schedule.AdditionalInformation,
                    }); ;

                    continue;
                }

                if (schedule.ScheduleRemovedDates.Any(y => y.Date == date))
                    continue;

                if (schedule.StartDate == null)
                    continue;

                if (date >= schedule.StartDate && date <= schedule.EndDate)
                {
                    DateTime startDate = schedule.StartDate.Value.ToDateTime(new TimeOnly());
                    DateTime dateTime = date.ToDateTime(new TimeOnly());

                    int weekSpan = (int)(dateTime - startDate).TotalDays / 7;

                    if (schedule.IsRolling && weekSpan % 2 == 1)
                        continue;

                    subjectForScheduleInfoDtos.Add(new SubjectForScheduleInfoDto()
                    {
                        Subject = schedule.Subject.ShortName != null ? schedule.Subject.ShortName : schedule.Subject.Name,
                        SubjectType = schedule.SubjectType.ShortName,
                        CoupleIndex = schedule.CoupleTime.Index - 1,
                        IsMySubgroup = schedule.SubgroupId == null || student.SubgroupId == schedule.SubgroupId,
                        Link = schedule.Link,
                        AdditionalInformation = schedule.AdditionalInformation,
                    });
                }
            }

            return subjectForScheduleInfoDtos.OrderByDescending(x => x.IsMySubgroup).ToList();
        }
    }
}
