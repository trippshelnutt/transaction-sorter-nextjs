namespace TransactionSorterBackend.Domain;

public interface IYnabHttpClientBuilder
{
    HttpClient BuildHttpClient();
}
