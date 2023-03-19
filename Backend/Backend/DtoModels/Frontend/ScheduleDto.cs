namespace Backend.DtoModels.Frontend
{
    public class ScheduleDto
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

        public IList<GroupDto> Groups { get; set; } = new List<GroupDto>();

        public IList<ScheduleDateDto> AdditionalDates { get; set; } = new List<ScheduleDateDto>();

        public IList<ScheduleDateDto> RemovedDates { get; set; } = new List<ScheduleDateDto>();
    }
}
