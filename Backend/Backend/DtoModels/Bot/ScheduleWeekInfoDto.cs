using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.DtoModels.Bot
{
    public class ScheduleWeekInfoDto
    {
        public List<string> CouplesTimes { get; set; } = new List<string>();

        public IDictionary<string, IList<SubjectForScheduleInfoDto>> Subjects { get; set; } = new Dictionary<string, IList<SubjectForScheduleInfoDto>>();
    }
}
