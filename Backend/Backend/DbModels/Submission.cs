namespace Backend.DbModels
{
    public class Submission
    {
        public int Id { get; set; }

        public int SubmissionWorkId { get; set; }

        public int StudentId { get; set; }

        public int SubmissionConfigId { get; set; }

        // Virtual properties

        public virtual Student Student { get; set; } = null!;

        public virtual SubmissionWork SubmissionWork { get; set; } = null!;

        public virtual SubmissionConfig SubmissionConfig { get; set; } = null!;
    }
}
