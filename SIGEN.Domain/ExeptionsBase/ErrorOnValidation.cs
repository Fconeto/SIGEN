using System.Net;

namespace SIGEN.Domain.ExeptionsBase;
public  class ErrorOnValidationException : SIGENExceptions
{
    private readonly List<string> _Errors;

    public override int StatusCode => (int)HttpStatusCode.BadRequest;

    public ErrorOnValidationException(List<string> errorMessages) : base(string.Empty)
    {
        _Errors = errorMessages;
    }

    public override List<string> GetErros()
    {
        return _Errors;
    }
 }