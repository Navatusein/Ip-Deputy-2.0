using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/frontend/teachers")]
    [ApiController]
    public class TeachersFrontendController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public TeachersFrontendController(ILogger<TeachersFrontendController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<TeacherDto>>> Get()
        {
            try
            {
                List<TeacherDto> dtos = await _context.Teachers
                    .OrderBy(x => x.Surname)
                    .Select(x => _mapper.Map<TeacherDto>(x))
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
        public async Task<ActionResult<TeacherDto>> Add(TeacherDto dto)
        {
            try
            {
                Teacher model = _mapper.Map<Teacher>(dto);

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
        public async Task<ActionResult<TeacherDto>> Update(TeacherDto dto)
        {
            try
            {
                if (!_context.Teachers.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid teacher id");

                Teacher model = _mapper.Map<Teacher>(dto);

                _context.Teachers.Update(model);
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
                Teacher? model = await _context.Teachers.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid teacher id");

                _context.Teachers.Remove(model);
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
