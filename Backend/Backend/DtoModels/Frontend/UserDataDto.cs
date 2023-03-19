namespace Backend.DtoModels.Frontend
{
    public class UserDataDto
    {
        public int StudentId { get; set; }

        public string UserName { get; set; } = null!;

        public string JwtToken { get; set; } = null!;
    }
}
