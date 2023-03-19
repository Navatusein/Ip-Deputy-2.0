namespace Backend.DbModels
{
    public class SubmissionWithGroup
    {
        public int Id { get; set; }

        public int SubmissionConfigId { get; set; }

        public int GroupId { get; set; }

        // Virtual properties

        public virtual SubmissionConfig SubmissionConfig { get; set; } = null!;

        public virtual Group Group { get; set; } = null!;
    }
}
