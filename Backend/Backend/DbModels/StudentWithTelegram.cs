namespace Backend.DbModels
{
    public class StudentWithTelegram
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int TelegramId { get; set; }

        public string Language { get; set; } = null!;

        public bool ScheduleCompact { get; set; }

        // Virtual properties

        public virtual Student Student { get; set; } = null!;
    }
}
