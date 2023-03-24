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
    [Route("api/frontend/subject-types")]
    [ApiController]
    public class SubjectTypesController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<SubjectTypesController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public SubjectTypesController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubjectTypeDto>>> Get()
        {
            try
            {
                List<SubjectTypeDto> dtos = await _context.SubjectTypes
                    .OrderBy(x => x.Id)
                    .Select(x => _mapper.Map<SubjectTypeDto>(x))
                    .ToListAsync();

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
