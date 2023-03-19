namespace Backend.DbModels
{
    public class SubgroupWithGroup
    {
        public int Id { get; set; }

        public int GroupId { get; set; }

        public int SubgroupId { get; set; }

        // Virtual properties

        public virtual Group Group { get; set; } = null!;

        public virtual Subgroup Subgroup { get; set; } = null!;
    }
}
