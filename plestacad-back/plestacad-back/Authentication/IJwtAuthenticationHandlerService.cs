namespace plestacad_back.Authentication
{
    public interface IJwtAuthenticationHandlerService
    {
        string Authenticate(string username, string password);
    }
}