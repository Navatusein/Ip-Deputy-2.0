namespace Backend.DbModels
{
    public class ScheduleRemovedDate
    {
        public int Id { get; set; }

        public int ScheduleId { get; set; }

        public DateOnly Date { get; set; }

        // Virtual properties

        public virtual Schedule Schedule { get; set; } = null!;

    }
}
