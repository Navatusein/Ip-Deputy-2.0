namespace Backend.DbModels
{
    public class Student
    {
        public int Id { get; set; }

        public int GroupId { get; set; }

        public int? SubgroupId { get; set; }

        public int Index { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string Patronymic { get; set; } = null!;

        public string TelegramPhone { get; set; } = null!;

        public string? ContactPhone { get; set; }

        public string Email { get; set; } = null!;

        public string FitEmail { get; set; } = null!;

        public string? TelegramNickname { get; set; } = null!;

        public DateOnly Birthday { get; set; }

        public DateOnly? LastCongratulations { get; set; }

        public DateTime? LastActivity { get; set; }

        // Virtual properties

        public virtual Group Group { get; set; } = null!;

        public virtual Subgroup? Subgroup { get; set; }

        public virtual StudentWithTelegram? StudentWithTelegram { get; set; }

        public virtual WebAdminAuth? WebAdminAuth { get; set; }
    }
}
