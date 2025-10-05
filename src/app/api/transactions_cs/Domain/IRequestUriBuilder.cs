namespace TransactionSorterBackend.Domain;

public interface IRequestUriBuilder
{
    Uri BuildRequestUriForCategory(string categoryId, DateTime startDate);
    Uri BuildRequestUriForTransaction(string transactionId);
}
