using TransactionSorterBackend.Models;

namespace TransactionSorterBackend.Domain;

public interface IYnabClient
{
    Task<List<TransactionModel>> GetTransactionsAsync(DateTime startDate, DateTime endDate, string category);
}
