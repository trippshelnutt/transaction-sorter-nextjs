using TransactionSorterBackend.Models;

namespace TransactionSorterBackend.Domain;

public class YnabClient : IYnabClient
{
    private readonly IConfiguration _configuration;
    private readonly ITransactionClient _transactionClient;
    private readonly IRequestUriBuilder _requestUriBuilder;

    public YnabClient(IConfiguration configuration, ITransactionClient transactionClient, IRequestUriBuilder requestUriBuilder)
    {
        _configuration = configuration;
        _transactionClient = transactionClient;
        _requestUriBuilder = requestUriBuilder;
    }

    public async Task<List<TransactionModel>> GetTransactionsAsync(DateTime startDate, DateTime endDate, string category)
    {
        var categorySetting = $"YNAB:{category}";
        var categoryId = _configuration[categorySetting];
        var requestUri = _requestUriBuilder.BuildRequestUriForCategory(categoryId, startDate);
        var response = await _transactionClient.GetTransactionsAsync(requestUri);

        var transactionTasks = response.Data.Transactions
            .Where(t => t.Date <= endDate)
            .OrderByDescending(t => t.MilliunitAmount)
            .Select(CheckAndFillParentInformationAsync);

        var transactions = await Task.WhenAll(transactionTasks);

        return transactions.ToList();
    }

    private async Task<TransactionModel> GetTransactionAsync(string transactionId)
    {
        var requestUri = _requestUriBuilder.BuildRequestUriForTransaction(transactionId);
        var response = await _transactionClient.GetTransactionAsync(requestUri);

        return response.Data.Transaction;
    }

    private async Task<TransactionModel> CheckAndFillParentInformationAsync(TransactionModel transaction)
    {
        if (string.IsNullOrEmpty(transaction.Payee))
        {
            return await FillParentInformationAsync(transaction);
        }

        return transaction;
    }

    private async Task<TransactionModel> FillParentInformationAsync(TransactionModel transaction)
    {
        var parentTransaction = await GetTransactionAsync(transaction.ParentTransactionId);
        transaction.Payee = parentTransaction.Payee;
        return transaction;
    }
}
