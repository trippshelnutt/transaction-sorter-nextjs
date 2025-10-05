using TransactionSorterBackend.Models;

namespace TransactionSorterBackend.Domain;

public interface ITransactionClient
{
    Task<GetTransactionsResponse> GetTransactionsAsync(Uri requestUri);
    Task<GetTransactionResponse> GetTransactionAsync(Uri requestUri);
}
