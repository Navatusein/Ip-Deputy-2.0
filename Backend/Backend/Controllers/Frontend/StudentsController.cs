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
    [Route("api/frontend/students")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<StudentsController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public StudentsController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<StudentDbo>>> GetByGroupId(int groupId)
        {
            try
            {
                List<StudentDbo> models = await _context.Students
                    .Where(x => x.GroupId == groupId)
                    .OrderBy(x => x.Index)
                    .Select(x => _mapper.Map<StudentDbo>(x))
                    .ToListAsync();

                return Ok(models);
            }
            catch (Exception ex)
            {
                _logger.Here().Error(ex, "");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<StudentDbo>> Add(StudentDbo dto)
        {
            try
            {
                Student model = _mapper.Map<Student>(dto);

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                dto.Id = model.Id;

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
        public async Task<ActionResult<StudentDbo>> Update(StudentDbo dto)
        {
            try
            {
                if (!_context.Students.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid student id");

                Student model = _mapper.Map<Student>(dto);

                _context.Students.Update(model);
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
                Student? model = await _context.Students.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid student id");

                _context.Students.Remove(model);
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
