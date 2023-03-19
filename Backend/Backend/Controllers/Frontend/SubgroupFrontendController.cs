using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/frontend/subgroups")]
    [ApiController]
    public class SubgroupsFrontendController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubgroupsFrontendController(ILogger<SubgroupsFrontendController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubgroupDto>>> Get()
        {
            try
            {
                List<SubgroupDto> models = await _context.Subgroups
                    .OrderBy(x => x.Name)
                    .Select(x => _mapper.Map<SubgroupDto>(x))
                    .ToListAsync();

                return Ok(models);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<SubgroupDto>> Add(SubgroupDto dto)
        {
            try
            {
                Subgroup model = _mapper.Map<Subgroup>(dto);

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
        public async Task<ActionResult<SubgroupDto>> Update(SubgroupDto dto)
        {
            try
            {
                if (!_context.Subgroups.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid subgroup id");

                Subgroup model = _mapper.Map<Subgroup>(dto);

                _context.Subgroups.Update(model);
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
                Subgroup? model = await _context.Subgroups.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid subgroup id");

                _context.Subgroups.Remove(model);
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
