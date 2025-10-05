namespace TransactionSorterBackend.Domain;

public class RequestUriBuilder : IRequestUriBuilder
{
    private readonly IConfiguration _configuration;

    public RequestUriBuilder(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Uri BuildRequestUriForCategory(string categoryId, DateTime startDate)
    {
        var uriBase = _configuration["YNAB:URL"];
        var budgetId = _configuration["YNAB:Budget"];
        var sinceDateString = startDate.ToString("yyyy-M-d");

        return new Uri($"{uriBase}/budgets/{budgetId}/categories/{categoryId}/transactions?since_date={sinceDateString}");
    }

    public Uri BuildRequestUriForTransaction(string transactionId)
    {
        var uriBase = _configuration["YNAB:URL"];
        var budgetId = _configuration["YNAB:Budget"];

        return new Uri($"{uriBase}/budgets/{budgetId}/transactions/{transactionId}");
    }
}
