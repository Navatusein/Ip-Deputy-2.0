namespace Backend.DbModels
{
    public class Teacher
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string Patronymic { get; set; } = null!;

        public string? ContactPhone { get; set; }

        public string? Email { get; set; }

        public string? FitEmail { get; set; }

        public string? TelegramNickname { get; set; }

        // Virtual properties

        public virtual IList<Schedule> Schedules { get; } = new List<Schedule>();
    }
}
