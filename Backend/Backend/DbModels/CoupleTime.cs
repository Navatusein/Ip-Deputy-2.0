namespace Backend.DbModels
{
    public class CoupleTime
    {
        public int Id { get; set; }

        public int Index { get; set; }

        public TimeOnly TimeStart { get; set; }

        public TimeOnly TimeEnd { get; set; }

        // Virtual properties

        public virtual IList<Schedule> Schedules { get; } = new List<Schedule>();
    }
}
