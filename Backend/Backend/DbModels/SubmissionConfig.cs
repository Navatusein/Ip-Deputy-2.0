namespace Backend.DbModels
{
    public class SubmissionConfig
    {
        public int Id { get; set; }

        public int SubjectId { get; set; }

        public int SubjectTypeId { get; set; }

        public int? SubgroupId { get; set; }

        // Virtual properties

        public virtual Subject Subject { get; set; } = null!;

        public virtual SubjectType SubjectType { get; set; } = null!;

        public virtual IList<SubmissionWithGroup> SubmissionWithGroups { get; } = new List<SubmissionWithGroup>();

        public virtual IList<SubmissionWork> SubmissionWorks { get; } = new List<SubmissionWork>();

        public virtual IList<Submission> Submissions { get; } = new List<Submission>();
    }
}
