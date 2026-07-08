
namespace DebtManager.Records
{
    public record CleanPersonGetDTO(
        Guid Id,
        string Name,
        int Age,
        Boolean IsDisabled

    ){}
}