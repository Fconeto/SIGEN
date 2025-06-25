namespace SIGEN.Domain.ExeptionsBase;
public abstract class SIGENExceptions : SystemException
{
    protected SIGENExceptions(string message) : base(message)
    {
        
    }

    public abstract int StatusCode { get; }
    public abstract List<string> GetErros();
}