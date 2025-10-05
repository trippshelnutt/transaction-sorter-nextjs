using System.Text.Json.Serialization;

namespace TransactionSorterBackend.Models;

public class TransactionModel
{
    [JsonPropertyName("amount")]
    public int MilliunitAmount { get; set; } = 0;

    [JsonPropertyName("payee_name")]
    public string Payee { get; set; } = string.Empty;

    [JsonPropertyName("parent_transaction_id")]
    public string ParentTransactionId { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; set; } = new();

    [JsonPropertyName("decimal_amount")]
    public decimal DecimalAmount => (MilliunitAmount / 1000.00m);

    [JsonPropertyName("display_amount")]
    public string DisplayAmount => $"{DecimalAmount:.00}";
}
