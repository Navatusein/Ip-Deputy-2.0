namespace Backend.DbModels
{
    public class Group
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        // Virtual properties

        public virtual IList<Student> Students { get; } = new List<Student>();

        public virtual IList<ScheduleWithGroup> ScheduleWithGroups { get; } = new List<ScheduleWithGroup>();

        public virtual IList<SubgroupWithGroup> SubgroupWithGroups { get; } = new List<SubgroupWithGroup>();
    }
}
