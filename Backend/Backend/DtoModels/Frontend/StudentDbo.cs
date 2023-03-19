namespace Backend.DtoModels.Frontend
{
    public class StudentDbo
    {
        public int Id { get; set; }

        public int GroupId { get; set; }

        public int SubgroupId { get; set; }

        public int Index { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string Patronymic { get; set; } = null!;

        public string TelegramPhone { get; set; } = null!;

        public string ContactPhone { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string FitEmail { get; set; } = null!;

        public string TelegramNickname { get; set; } = null!;

        public int? TelegramId { get; set; }

        public DateOnly Birthday { get; set; }

        public DateOnly? LastCongratulations { get; set; }

        public DateTime? LastActivity { get; set; }
    }
}
