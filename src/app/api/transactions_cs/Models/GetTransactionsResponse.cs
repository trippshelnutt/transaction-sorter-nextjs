using System.Text.Json.Serialization;

namespace TransactionSorterBackend.Models;

public class GetTransactionsResponse
{
    [JsonPropertyName("data")]
    public MultipleTransactionData Data { get; set; } = new();
}
