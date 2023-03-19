using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/frontend/couples")]
    [ApiController]
    public class CouplesFrontendController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public CouplesFrontendController(ILogger<CouplesFrontendController> logger, IpDeputyDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<CoupleTimeDto>>> Get()
        {
            try
            {
                List<CoupleTimeDto> dtos = await _context.CoupleTimes
                    .OrderBy(x => x.TimeStart)
                    .Select(x => _mapper.Map<CoupleTimeDto>(x))
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
