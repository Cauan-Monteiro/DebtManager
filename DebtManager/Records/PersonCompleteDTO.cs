using DebtManager.Entities;

namespace DebtManager.Records
{
    public record PersonCompleteDTO(
        Guid Id,
        string Name,
        int Age,
        decimal TotalExpenses,
        decimal TotalRevenues,
        decimal TotalBalance
    ){}
}