using Microsoft.EntityFrameworkCore;

namespace Backend.DbModels
{
    public class IpDeputyDbContext : DbContext
    {
        public DbSet<CoupleTime> CoupleTimes { get; set; }
        public DbSet<DayOfWeek> DayOfWeeks { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<ScheduleAdditionalDate> ScheduleAdditionalDates { get; set; }
        public DbSet<ScheduleRemovedDate> ScheduleRemovedDates { get; set; }
        public DbSet<ScheduleWithGroup> ScheduleWithGroups { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentWithTelegram> StudentWithTelegram { get; set; }
        public DbSet<Subgroup> Subgroups { get; set; }
        public DbSet<SubgroupWithGroup> SubgroupWithGroups { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<SubjectType> SubjectTypes { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<SubmissionConfig> SubmissionConfigs { get; set; }
        public DbSet<SubmissionWithGroup> SubmissionWithGroups { get; set; }
        public DbSet<SubmissionWork> SubmissionWorks { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<WebAdminAuth> WebAdminAuths { get; set; }

        public IpDeputyDbContext(DbContextOptions<IpDeputyDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CoupleTime>().HasData(
                new CoupleTime { Id = 1, Index = 1, TimeStart = new TimeOnly(9, 10), TimeEnd = new TimeOnly(10, 20) },
                new CoupleTime { Id = 2, Index = 2, TimeStart = new TimeOnly(10, 30), TimeEnd = new TimeOnly(11, 50) },
                new CoupleTime { Id = 3, Index = 3, TimeStart = new TimeOnly(12, 10), TimeEnd = new TimeOnly(13, 30) },
                new CoupleTime { Id = 4, Index = 4, TimeStart = new TimeOnly(13, 40), TimeEnd = new TimeOnly(15, 0) },
                new CoupleTime { Id = 5, Index = 5, TimeStart = new TimeOnly(15, 10), TimeEnd = new TimeOnly(16, 30) },
                new CoupleTime { Id = 6, Index = 6, TimeStart = new TimeOnly(16, 40), TimeEnd = new TimeOnly(18, 0) },
                new CoupleTime { Id = 7, Index = 7, TimeStart = new TimeOnly(18, 10), TimeEnd = new TimeOnly(19, 30) }
            );

            modelBuilder.Entity<DayOfWeek>().HasData(
                new DayOfWeek { Id = 1, Index = 1, Name = "Понеділок" },
                new DayOfWeek { Id = 2, Index = 2, Name = "Вівторок" },
                new DayOfWeek { Id = 3, Index = 3, Name = "Середа" },
                new DayOfWeek { Id = 4, Index = 4, Name = "Четвер" },
                new DayOfWeek { Id = 5, Index = 5, Name = "П'ятниця" },
                new DayOfWeek { Id = 6, Index = 6, Name = "Субота" },
                new DayOfWeek { Id = 7, Index = 0, Name = "Неділя" }
            );

            modelBuilder.Entity<SubjectType>().HasData(
                new SubjectType { Id = 1, Name = "Лабораторне", ShortName = "Лаб." },
                new SubjectType { Id = 2, Name = "Практика", ShortName = "Пр." },
                new SubjectType { Id = 3, Name = "Лекція", ShortName = "Лек." },
                new SubjectType { Id = 4, Name = "Консультація", ShortName = "Конс." },
                new SubjectType { Id = 5, Name = "Семінар", ShortName = "Сем." }
            );

            modelBuilder.Entity<Group>().HasData(
                new Group { Id = 1, Name = "ІР-21" }
            );

            modelBuilder.Entity<Subgroup>().HasData(
                new Subgroup { Id = 1, Index = 1, Name = "ІР-2/1" }
            );

            modelBuilder.Entity<SubgroupWithGroup>().HasData(
                new SubgroupWithGroup { Id = 1, GroupId = 1, SubgroupId = 1 }
            );

            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    GroupId = 1,
                    SubgroupId = 1,
                    Index = 1,
                    Name = "Богдан",
                    Surname = "Куцуліма",
                    Patronymic = "Юрійович",
                    TelegramPhone = "380964981430",
                    ContactPhone = "380964981430",
                    Email = "boghdan.kutsulima@gmail.com",
                    FitEmail = "kutsulimab@fit.knu.ua",
                    TelegramNickname = "@Navatusein",
                    Birthday = new DateOnly(2004, 04, 08)
                }
            );

            modelBuilder.Entity<WebAdminAuth>().HasData(
                new WebAdminAuth 
                { 
                    Id = 1, 
                    Login = "login",
                    StudentId = 1,
                    PasswordHash = "SYEvwD7y6CSjN6NNtIkAplCYIvCqaRQbabxj9iv9X0NpfwrKHQmtInAHuwniroRq4lDpClOqYypv6gZ9qk4YwNcu8EGElzOAtaBjxrBW8eznG1co2yfYiBeiSUHNar/dbfYLrVn6Fp8vFwhycvKmBjXB2+y/BLj9VaR6s6Im+Ts=", 
                    PasswordSalt = "a6R4ivhnD2w0++Ygi50FWDaCm/7xUORyvkaxxD/A5i6Stps2D/Pn8VWwyZsHPmqFEt6RrFNX0sF71J0tlexpXA=="
                }
            );
        }
    }
}
