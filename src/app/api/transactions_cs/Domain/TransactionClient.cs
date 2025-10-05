using TransactionSorterBackend.Models;

namespace TransactionSorterBackend.Domain;

public class TransactionClient : ITransactionClient
{
    private readonly IYnabHttpClientBuilder _ynabHttpClientBuilder;

    public TransactionClient(IYnabHttpClientBuilder ynabHttpClientBuilder)
    {
        _ynabHttpClientBuilder = ynabHttpClientBuilder;
    }

    public async Task<GetTransactionsResponse> GetTransactionsAsync(Uri requestUri)
    {
        using var httpClient = _ynabHttpClientBuilder.BuildHttpClient();

        var response = await httpClient.GetFromJsonAsync<GetTransactionsResponse>(requestUri);

        return response ?? new GetTransactionsResponse();
    }

    public async Task<GetTransactionResponse> GetTransactionAsync(Uri requestUri)
    {
        using var httpClient = _ynabHttpClientBuilder.BuildHttpClient();

        var response = await httpClient.GetFromJsonAsync<GetTransactionResponse>(requestUri);

        return response ?? new GetTransactionResponse();
    }
}
