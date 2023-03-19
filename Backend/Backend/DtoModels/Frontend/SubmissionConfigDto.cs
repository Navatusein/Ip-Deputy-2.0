namespace Backend.DtoModels.Frontend
{
    public class SubmissionConfigDto
    {
        public int Id { get; set; }

        public int SubjectId { get; set; }

        public int SubjectTypeId { get; set; }

        public int? SubgroupId { get; set; }

        public IList<GroupDto> Groups { get; set; } = new List<GroupDto>();

        public IList<SubmissionWorkDto> SubmissionWorks { get; set; } = new List<SubmissionWorkDto>();
    }
}
