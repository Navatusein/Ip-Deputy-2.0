namespace Backend.DbModels
{
    public class SubmissionWork
    {
        public int Id { get; set; }

        public int SubmissionConfigId { get; set; }

        public string Name { get; set; } = null!;

        // Virtual properties

        public virtual SubmissionConfig SubmissionConfig { get; set; } = null!;

        public virtual IList<Submission> Submissions { get; } = new List<Submission>();
    }
}
