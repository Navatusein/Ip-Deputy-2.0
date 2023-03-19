namespace Backend.DtoModels.Bot
{
    public class StudentLoginDto
    {
        public int TelegramId { get; set; }

        public string TelegramPhone { get; set; } = null!;
    }
}
