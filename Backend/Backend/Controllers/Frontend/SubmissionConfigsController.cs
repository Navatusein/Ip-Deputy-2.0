using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Backend.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Frontend
{
    [Route("api/frontend/submission-config")]
    [ApiController]
    public class SubmissionConfigsController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<SubmissionConfigsController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubmissionConfigsController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubmissionConfigDto>>> Get()
        {
            try
            {
                List<SubmissionConfig> models = await _context.SubmissionConfigs
                    .ToListAsync();

                List<SubmissionConfigDto> dtos = new List<SubmissionConfigDto>();

                foreach (var model in models)
                {
                    SubmissionConfigDto dto = _mapper.Map<SubmissionConfigDto>(model);

                    dto.Groups = model.SubmissionWithGroups
                        .Select(x => _mapper.Map<GroupDto>(x.Group))
                        .ToList();

                    dto.SubmissionWorks = model.SubmissionWorks
                        .Select(x => _mapper.Map<SubmissionWorkDto>(x))
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
        public async Task<ActionResult<SubgroupDto>> Add(SubmissionConfigDto dto)
        {
            try
            {
                if (!dto.Groups.All(x => _context.Groups.Any(y => y.Id == x.Id)))
                    return BadRequest("Invalid groups");

                SubmissionConfig model = _mapper.Map<SubmissionConfig>(dto);

                foreach (var item in model.SubmissionWorks)
                {
                    Console.WriteLine(item.Name);
                }

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                

                dto.Id = model.Id;

                List<SubmissionWithGroup> submissionWithGroups = new List<SubmissionWithGroup>();
                List<SubmissionWork> submissionWorks = new List<SubmissionWork>();

                foreach (var group in dto.Groups)
                {
                    submissionWithGroups.Add(new SubmissionWithGroup
                    {
                        SubmissionConfigId = dto.Id,
                        GroupId = group.Id
                    });
                }

                foreach (var submissionWork in dto.SubmissionWorks)
                {
                    submissionWorks.Add(_mapper.Map<SubmissionWork>(submissionWork, opt => opt.AfterMap((src, dest) => dest.SubmissionConfigId = model.Id)));
                }

                await _context.AddRangeAsync(submissionWithGroups);
                await _context.AddRangeAsync(submissionWorks);
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
        public async Task<ActionResult<SubmissionConfigDto>> Update(SubmissionConfigDto dto)
        {
            try
            {
                if (dto.SubgroupId != null && !_context.Subgroups.Any(x => x.Id == dto.SubgroupId))
                    return BadRequest("Invalid subgroups id");

                if (!dto.Groups.All(x => _context.Groups.Any(y => y.Id == x.Id)))
                    return BadRequest("Invalid groups");

                SubmissionConfig model = _mapper.Map<SubmissionConfig>(dto);

                _context.SubmissionConfigs.Update(model);
                await _context.SaveChangesAsync();

                List<SubmissionWithGroup> submissionWithGroups = new List<SubmissionWithGroup>();
                List<SubmissionWork> submissionWorks = new List<SubmissionWork>();

                foreach (var group in dto.Groups)
                {
                    submissionWithGroups.Add(new SubmissionWithGroup
                    {
                        SubmissionConfigId = dto.Id,
                        GroupId = group.Id
                    });
                }

                foreach (var submissionWork in dto.SubmissionWorks)
                {
                    submissionWorks.Add(_mapper.Map<SubmissionWork>(submissionWork, opt => opt.AfterMap((src, dest) => dest.SubmissionConfigId = model.Id)));
                }

                _context.SubmissionWithGroups.RemoveRange(await _context.SubmissionWithGroups.Where(x => x.SubmissionConfigId == dto.Id).ToListAsync());
                _context.SubmissionWorks.RemoveRange(await _context.SubmissionWorks.Where(x => x.SubmissionConfigId == dto.Id).ToListAsync());
                await _context.AddRangeAsync(submissionWithGroups);
                await _context.AddRangeAsync(submissionWorks);
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
                SubmissionConfig? model = await _context.SubmissionConfigs.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid submission config id");

                _context.SubmissionConfigs.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(id);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        
        [Authorize]
        [Route("for-student")]
        [HttpGet]
        public async Task<ActionResult<List<SubmissionConfigDto>>> GetForStudentId(int studentId)
        {
            try
            {
                Student? student = await _context.Students.FirstOrDefaultAsync(y => y.Id == studentId);

                if (student == null)
                    return BadRequest("Invalid student id");

                List<SubmissionConfig> models = await _context.SubmissionConfigs
                    .Where(x => x.SubmissionWithGroups.Any(y => y.GroupId == student.GroupId) && (x.SubgroupId == null || x.SubgroupId == student.SubgroupId))
                    .ToListAsync();

                List<SubmissionConfigDto> dtos = new List<SubmissionConfigDto>();

                foreach (var model in models)
                {
                    SubmissionConfigDto dto = _mapper.Map<SubmissionConfigDto>(model);

                    dto.Groups = model.SubmissionWithGroups
                        .Select(x => _mapper.Map<GroupDto>(x.Group))
                        .ToList();

                    dto.SubmissionWorks = model.SubmissionWorks
                        .Select(x => _mapper.Map<SubmissionWorkDto>(x))
                        .ToList();

                    foreach (var submissionWork in dto.SubmissionWorks)
                    {
                        submissionWork.IsSubmission = await _context.Submissions.AnyAsync(y => y.SubmissionWorkId == submissionWork.Id && y.StudentId == student.Id);
                    }

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
    }
}
