using System.Net.Http.Headers;

namespace TransactionSorterBackend.Domain;

public class YnabHttpClientBuilder : IYnabHttpClientBuilder
{
    private readonly IConfiguration _configuration;

    public YnabHttpClientBuilder(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public HttpClient BuildHttpClient()
    {
        var client = new HttpClient();

        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Authorization", $"BEARER {_configuration["YNAB:apiKey"]}");

        return client;
    }
}
