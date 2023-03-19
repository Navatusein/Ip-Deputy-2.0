namespace Backend.DtoModels.Bot
{
    public class ScheduleDayInfoDto
    {
        public IList<string> CouplesTimes { get; set; } = new List<string>();

        public IList<SubjectForScheduleInfoDto> Subjects { get; set; } = new List<SubjectForScheduleInfoDto>();
    }
}
