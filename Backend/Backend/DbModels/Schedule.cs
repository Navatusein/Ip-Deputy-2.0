namespace Backend.DbModels
{
    public class Schedule
    {
        public int Id { get; set; }

        public int SubjectId { get; set; }

        public int SubjectTypeId { get; set; }

        public int DayOfWeekId { get; set; }

        public int CoupleTimeId { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public bool IsRolling { get; set; }

        public int? SubgroupId { get; set; }

        public int TeacherId { get; set; }

        public string? AdditionalInformation { get; set; }

        public string? Link { get; set; } = null!;

        // Virtual properties

        public virtual Subject Subject { get; set; } = null!;

        public virtual SubjectType SubjectType { get; set; } = null!;

        public virtual DayOfWeek DayOfWeek { get; set; } = null!;

        public virtual CoupleTime CoupleTime { get; set; } = null!;

        public virtual Subgroup Subgroup { get; set; } = null!;

        public virtual Teacher Teacher { get; set; } = null!;

        public virtual IList<ScheduleWithGroup> ScheduleWithGroups { get; } = new List<ScheduleWithGroup>();

        public virtual IList<ScheduleAdditionalDate> ScheduleAdditionalDates { get; } = new List<ScheduleAdditionalDate>();

        public virtual IList<ScheduleRemovedDate> ScheduleRemovedDates { get; } = new List<ScheduleRemovedDate>();
    }
}
