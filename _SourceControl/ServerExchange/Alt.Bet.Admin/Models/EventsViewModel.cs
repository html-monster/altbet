using System;
using System.Collections.Generic;

namespace AltBet.Admin.Models
{
    public class EventsViewModel
    {
        public List<Events> FeedEvents { get; set; }
        public List<string> AllSport { get; set; }
        public List<string> AllLeague { get; set; }
        public string Sport { get; set; }
        public string League { get; set; }
        public string Sort { get; set; }
        public string CurrentOrderBy { get; set; }
        public string OrderBy { get; set; }
        public string StartDateSort { get; set; }
        public PageInfo PageInfo { get; set; }
    }

    public class Events
    {
        public Guid EventId { get; set; }
        public string Sport { get; set; }
        public string League { get; set; }
        public string Status { get; set; }
        public string StartDate { get; set; }
        public string FullName { get; set; }
    }

    public class PageInfo
    {
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int FirstPage { get; set; }
        public int LastPage { get; set; }

        public PageInfo(int totalItems, int? page, int pageSize)
        {
            var totalPages = (int)Math.Ceiling((decimal)totalItems / (decimal)pageSize);
            var currentPage = page ?? 1;
            var firstPage = currentPage - 5;
            var lastPage = currentPage + 4;
            if (firstPage <= 0)
            {
                lastPage -= (firstPage - 1);
                firstPage = 1;
            }
            if (lastPage > totalPages)
            {
                lastPage = totalPages;
                if (lastPage > 10)
                {
                    firstPage = lastPage - 9;
                }
            }

            TotalItems = totalItems;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalPages = totalPages;
            FirstPage = firstPage;
            LastPage = lastPage;
        }
    }
}