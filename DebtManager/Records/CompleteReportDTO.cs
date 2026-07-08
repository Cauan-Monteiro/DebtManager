
namespace DebtManager.Records
{
    public record CompleteReportDTO(
        List<PersonCompleteDTO> People,
        decimal GrandTotalExpenses,
        decimal GrandTotalRevenues,
        decimal GrandTotalBalance
    ){}
}