namespace Backend.DtoModels.Frontend
{
    public class SubmissionWorkDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public bool IsSubmission { get; set; }
    }
}
