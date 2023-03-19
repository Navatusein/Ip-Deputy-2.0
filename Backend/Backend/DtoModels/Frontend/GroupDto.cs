namespace Backend.DtoModels.Frontend
{
    public class GroupDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public IList<SubgroupDto> Subgroups { get; set; } = new List<SubgroupDto>();
    }
}
