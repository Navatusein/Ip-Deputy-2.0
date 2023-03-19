using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Bot;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Frontend
{
    [Route("api/frontend/submissions")]
    [ApiController]
    public class SubmissionsFrontendController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubmissionsFrontendController(ILogger<SubmissionsFrontendController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubmissionDto>>> Get()
        {
            try
            {
                List<SubmissionDto> dtos = await _context.Submissions
                   .OrderBy(x => x.SubmissionWork.Name)
                   .Select(x => _mapper.Map<SubmissionDto>(x))
                   .ToListAsync();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<SubmissionDto>> Add(SubmissionDto dto)
        {
            try
            {
                Submission? model = await _context.Submissions
                    .FirstOrDefaultAsync(x => x.SubmissionWorkId == dto.SubmissionWorkId && x.StudentId == dto.StudentId);

                if (model != null)
                    return BadRequest("This submission already exists");


                model = _mapper.Map<Submission>(dto);

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<SubmissionDto>> Update(SubmissionDto dto)
        {
            try
            {
                if (!_context.Submissions.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid submissions id");

                Submission model = _mapper.Map<Submission>(dto);

                _context.Submissions.Update(model);
                await _context.SaveChangesAsync();

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult<int>> Delete(int id)
        {
            try
            {
                Submission? model = await _context.Submissions.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid submissions id");

                _context.Submissions.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        //[Authorize]
        [Route("for-student")]
        [HttpGet]
        public async Task<ActionResult<List<SubmissionDto>>> GetForStudentId(int studentId)
        {
            try
            {
                List<SubmissionDto> dtos = await _context.Submissions
                    .Where(x => x.StudentId == studentId)
                    .OrderBy(x => x.SubmissionWork.Name)
                    .Select(x => _mapper.Map<SubmissionDto>(x))
                    .ToListAsync();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
