using System.Text.Json.Serialization;

namespace TransactionSorterBackend.Models;

public class MultipleTransactionData
{
    [JsonPropertyName("transactions")]
    public List<TransactionModel> Transactions { get; set; } = new();
}
