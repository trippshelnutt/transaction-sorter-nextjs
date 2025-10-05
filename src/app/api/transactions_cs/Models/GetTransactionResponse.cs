using System.Text.Json.Serialization;

namespace TransactionSorterBackend.Models;

public class GetTransactionResponse
{
    [JsonPropertyName("data")]
    public SingleTransactionData Data { get; set; } = new();
}
