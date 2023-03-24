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
    [Route("api/frontend/groups")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private static Serilog.ILogger _logger => Serilog.Log.ForContext<GroupsController>();
        private readonly IpDeputyDbContext _context;
        private readonly IMapper _mapper;

        public GroupsController(IpDeputyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<GroupDto>>> Get()
        {
            try
            {
                List<Group> models = await _context.Groups
                    .OrderBy(x => x.Name)
                    .ToListAsync();

                List<GroupDto> dtos = new List<GroupDto>();

                foreach (var model in models)
                {
                    GroupDto dto = _mapper.Map<GroupDto>(model);

                    dto.Subgroups = model.SubgroupWithGroups
                        .OrderBy(x => x.Subgroup.Index)
                        .Select(x => _mapper.Map<SubgroupDto>(x.Subgroup))
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
        public async Task<ActionResult<GroupDto>> Add(GroupDto dto)
        {
            try
            {
                Group model = _mapper.Map<Group>(dto);

                if (!dto.Subgroups.All(x => _context.Subgroups.Any(y => y.Id == x.Id)))
                    return BadRequest("Invalid subgroups");

                await _context.AddAsync(model);
                await _context.SaveChangesAsync();

                dto.Id = model.Id;

                List<SubgroupWithGroup> subgroupWithGroups = new List<SubgroupWithGroup>();

                foreach (var subgroup in dto.Subgroups)
                {
                    subgroupWithGroups.Add(new SubgroupWithGroup
                    {
                        GroupId = dto.Id,
                        SubgroupId = subgroup.Id
                    });
                }

                await _context.AddRangeAsync(subgroupWithGroups);
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
        public async Task<ActionResult<GroupDto>> Update(GroupDto dto)
        {
            try
            {
                if (!_context.Groups.Any(x => x.Id == dto.Id))
                    return BadRequest("Invalid group id");

                if (!dto.Subgroups.All(x => _context.Subgroups.Any(y => y.Id == x.Id)))
                    return BadRequest("Invalid subgroups");

                Group model = _mapper.Map<Group>(dto);

                _context.Groups.Update(model);
                await _context.SaveChangesAsync();

                dto.Id = model.Id;

                List<SubgroupWithGroup> subgroupWithGroups = new List<SubgroupWithGroup>();

                foreach (var subgroup in dto.Subgroups)
                {
                    subgroupWithGroups.Add(new SubgroupWithGroup
                    {
                        GroupId = dto.Id,
                        SubgroupId = subgroup.Id
                    });
                }

                _context.SubgroupWithGroups.RemoveRange(await _context.SubgroupWithGroups.Where(x => x.GroupId == dto.Id).ToListAsync());
                await _context.AddRangeAsync(subgroupWithGroups);
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
                Group? model = await _context.Groups.FirstOrDefaultAsync(x => x.Id == id);

                if (model == null)
                    return BadRequest("Invalid group id");

                _context.Groups.Remove(model);
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
