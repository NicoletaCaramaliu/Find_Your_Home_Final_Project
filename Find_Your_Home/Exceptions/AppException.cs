namespace Find_Your_Home.Exceptions
{
    public class AppException : Exception
    {
        public string ErrorCode { get; }

        public AppException(string errorCode) : base(errorCode)
        {
            ErrorCode = errorCode;
        }
    }
}