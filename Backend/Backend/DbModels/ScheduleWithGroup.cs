namespace Backend.DbModels
{
    public class ScheduleWithGroup
    {
        public int Id { get; set; }

        public int GroupId { get; set; }

        public int ScheduleId { get; set; }

        // Virtual properties

        public virtual Group Group { get; set; } = null!;

        public virtual Schedule Schedule { get; set; } = null!;
    }
}
