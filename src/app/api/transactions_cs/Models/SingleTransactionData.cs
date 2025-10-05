using System.Text.Json.Serialization;

namespace TransactionSorterBackend.Models;

public class SingleTransactionData
{
    [JsonPropertyName("transaction")]
    public TransactionModel Transaction { get; set; } = new();
}
