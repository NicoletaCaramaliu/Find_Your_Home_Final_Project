namespace Find_Your_Home.Helpers
{  
    public static class PaginationHelper
    {
        public static IQueryable<T> ApplyPagination<T>(IQueryable<T> query, int pageNumber, int pageSize)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize <= 0 || pageSize > 50 ? 10 : pageSize;
            return query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }
    }

}