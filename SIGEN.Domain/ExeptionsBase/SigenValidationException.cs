using System;

namespace SIGEN.Domain.ExeptionsBase
{
    public class SigenValidationException : Exception
    {
        public SigenValidationException(string message) : base(message)
        {
        }
    }
}
