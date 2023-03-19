namespace Backend.DbModels
{
    public class Subgroup
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int Index { get; set; }

        // Virtual properties

        public virtual IList<Student> Students { get; } = new List<Student>();

        public virtual IList<SubgroupWithGroup> SubgroupWithGroups { get; } = new List<SubgroupWithGroup>();

    }
}
