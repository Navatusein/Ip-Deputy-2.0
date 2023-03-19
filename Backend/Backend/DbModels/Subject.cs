namespace Backend.DbModels
{
    public class Subject
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? ShortName { get; set; }

        public int LaboratoryCount { get; set; }

        public int PracticalCount { get; set; }

        // Virtual properties

        public virtual IList<Schedule> Schedules { get; } = new List<Schedule>();
    }
}
