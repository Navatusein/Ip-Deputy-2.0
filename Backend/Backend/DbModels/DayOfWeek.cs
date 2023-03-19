namespace Backend.DbModels
{
    public class DayOfWeek
    {
        public int Id { get; set; }

        public int Index { get; set; }

        public string Name { get; set; } = null!;

        // Virtual properties

        public virtual IList<Schedule> Schedules { get; } = new List<Schedule>();
    }
}
