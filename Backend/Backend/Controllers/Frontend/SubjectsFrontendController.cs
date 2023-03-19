using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/frontend/subjects")]
    [ApiController]
    public class SubjectsFrontendController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubjectsFrontendController(ILogger<SubjectsFrontendController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubjectDto>>> Get()
        {
            try
            {
                List<SubjectDto> dtos = await _context.Subjects
                    .OrderBy(x => x.Name)
                    .Select(x => _mapper.Map<SubjectDto>(x))
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
        public async Task<ActionResult<SubjectDto>> Add(SubjectDto dto)
        {
            try
            {
                Subject model = _mapper.Map<Subject>(dto);

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                dto.Id = model.Id;

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
        public async Task<ActionResult<SubjectDto>> Update(SubjectDto dto)
        {
            try
            {
                if (!_context.Subjects.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid subject id");

                Subject model = _mapper.Map<Subject>(dto);

                _context.Subjects.Update(model);
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
                Subject? model = await _context.Subjects.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid subject id");

                _context.Subjects.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
