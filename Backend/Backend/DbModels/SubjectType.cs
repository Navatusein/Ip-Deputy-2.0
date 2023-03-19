namespace Backend.DbModels
{
    public class SubjectType
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string ShortName { get; set; } = null!;

        // Virtual properties

        public virtual IList<Schedule> Schedules { get; } = new List<Schedule>();
    }
}
