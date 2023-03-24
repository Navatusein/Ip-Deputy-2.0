using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/frontend/schedules")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<SchedulesController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SchedulesController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ScheduleDto>>> GetByDayOfWeekId(int dayOfWeekId)
        {
            try
            {
                List<Schedule> models = await _context.Schedules
                    .Where(x => x.DayOfWeekId == dayOfWeekId)
                    .OrderBy(x => x.DayOfWeekId)
                    .OrderBy(x => x.CoupleTimeId)
                    .OrderBy(x => x.StartDate)
                    .ToListAsync();

                List<ScheduleDto> dtos = new List<ScheduleDto>();

                foreach(var model in models)
                {
                    ScheduleDto dto = _mapper.Map<ScheduleDto>(model);

                    dto.Groups = model.ScheduleWithGroups
                        .Select(x => _mapper.Map<GroupDto>(x.Group))
                        .OrderBy(x => x.Name)
                        .ToList();

                    dto.AdditionalDates = model.ScheduleRemovedDates
                        .OrderBy(x => x.Date)
                        .Select(x => _mapper.Map<ScheduleDateDto>(x))
                        .ToList();

                    dto.AdditionalDates = model.ScheduleAdditionalDates
                        .OrderBy(x => x.Date)
                        .Select(x => _mapper.Map<ScheduleDateDto>(x))
                        .ToList();

                    dtos.Add(dto);
                }

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ScheduleDto>> Add(ScheduleDto dto)
        {
            try
            {
                Schedule model = _mapper.Map<Schedule>(dto);

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                dto.Id = model.Id;

                List<ScheduleAdditionalDate> scheduleAdditionalDates = dto.AdditionalDates
                    .Select(x => _mapper.Map<ScheduleAdditionalDate>(x, opt => opt.AfterMap((src, dest) => dest.ScheduleId = model.Id)))
                    .ToList();
                List<ScheduleRemovedDate> scheduleRemovedDates = dto.RemovedDates
                    .Select(x => _mapper.Map<ScheduleRemovedDate>(x, opt => opt.AfterMap((src, dest) => dest.ScheduleId = model.Id)))
                    .ToList();

                List<ScheduleWithGroup> scheduleWithGroups = dto.Groups.Select(x => 
                    new ScheduleWithGroup() { 
                        GroupId = x.Id, 
                        ScheduleId = dto.Id
                    }).ToList();

                await _context.AddRangeAsync(scheduleAdditionalDates);
                await _context.AddRangeAsync(scheduleRemovedDates);
                await _context.AddRangeAsync(scheduleWithGroups);
                await _context.SaveChangesAsync();

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<ScheduleDto>> Update(ScheduleDto dto)
        {
            try
            {
                if (!_context.Schedules.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid schedule id");

                //Переделать
                if (!dto.Groups.All(x => _context.Groups.Any(y => y.Id == x.Id)))
                    return BadRequest("Invalid groups");

                Schedule model = _mapper.Map<Schedule>(dto);

                _context.Schedules.Update(model);
                await _context.SaveChangesAsync();

                List<ScheduleAdditionalDate> scheduleAdditionalDates = dto.AdditionalDates
                    .Select(x => _mapper.Map<ScheduleAdditionalDate>(x, opt => opt.AfterMap((src, dest) => dest.ScheduleId = model.Id)))
                    .ToList();

                List<ScheduleRemovedDate> scheduleRemovedDates = dto.RemovedDates
                    .Select(x => _mapper.Map<ScheduleRemovedDate>(x, opt => opt.AfterMap((src, dest) => dest.ScheduleId = model.Id)))
                    .ToList();

                List<ScheduleWithGroup> scheduleWithGroups = dto.Groups.Select(x =>
                    new ScheduleWithGroup() {
                        GroupId = x.Id,
                        ScheduleId = dto.Id
                    }).ToList();

                _context.ScheduleAdditionalDates.RemoveRange(await _context.ScheduleAdditionalDates.Where(x => x.ScheduleId == dto.Id).ToListAsync());
                _context.ScheduleRemovedDates.RemoveRange(await _context.ScheduleRemovedDates.Where(x => x.ScheduleId == dto.Id).ToListAsync());
                _context.ScheduleWithGroups.RemoveRange(await _context.ScheduleWithGroups.Where(x => x.ScheduleId == dto.Id).ToListAsync());
                await _context.SaveChangesAsync();

                await _context.AddRangeAsync(scheduleAdditionalDates);
                await _context.AddRangeAsync(scheduleRemovedDates);
                await _context.AddRangeAsync(scheduleWithGroups);
                await _context.SaveChangesAsync();

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult<int>> Delete(int id)
        {
            try
            {
                Schedule? model = await _context.Schedules.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid schedule id");

                _context.Schedules.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(id);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
