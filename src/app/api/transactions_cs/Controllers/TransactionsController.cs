using Microsoft.AspNetCore.Mvc;
using TransactionSorterBackend.Domain;
using TransactionSorterBackend.Models;

namespace TransactionSorterBackend.Controllers;

[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly ILogger<TransactionsController> _logger;
    private readonly IYnabClient _ynabClient;

    public TransactionsController(ILogger<TransactionsController> logger, IYnabClient ynabClient)
    {
        _logger = logger;
        _ynabClient = ynabClient;
    }

    [HttpGet("/api/[controller]/{category}/{year}/{month}")]
    public async Task<IEnumerable<TransactionModel>> GetTransactions(int year, int month, string category)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var transactions = await _ynabClient.GetTransactionsAsync(startDate, endDate, category);

        return transactions;
    }
}
