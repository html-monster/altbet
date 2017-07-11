using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using AltBet.Exchange;

namespace AltBet.Admin.Models
{
    public class ExchangeViewModel
    {
        public string Exchange { get; set; }

        public string FullName { get; set; }

        [Required(ErrorMessage = "HomeName is required")]
        [StringLength(50)]
        public string HomeName { get; set; }

        [StringLength(20)]
        public string HomeAlias { get; set; }
        
        [Required(ErrorMessage = "AwayName is required")]
        [StringLength(50)]
        public string AwayName { get; set; }

        [StringLength(20)]
        public string AwayAlias { get; set; }

        [DisplayFormat(DataFormatString = "{0:n1}")]
        [StringLength(6)]
        public string HomeHandicap { get; set; }

        [DisplayFormat(DataFormatString = "{0:n1}")]
        [StringLength(6)]
        public string AwayHandicap { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }

        [StringLength(100)]
        public string UrlExchange { get; set; }

        [StringLength(20)]
        public string Status { get; set; }
        
        public TypeEvent TypeEvent { get; set; }
        
        [StringLength(50)]
        public string ResultExchange { get; set; }
        
        [StringLength(50)]
        public string Category { get; set; }

        //[DisplayFormat(DataFormatString = "{0:n2}", ApplyFormatInEditMode = true)]
        //[Range(0.1, 999.9, ErrorMessage = "Fantasy HomePoints must be greater than 0.0")]
        public decimal? HomePoints { get; set; }
        
        //[DisplayFormat(DataFormatString = "{0:n2}", ApplyFormatInEditMode = true)]
        //[Range(0.1, 999.9, ErrorMessage = "Fantasy AwayPoints must be greater than 0.0")]
        public decimal? AwayPoints { get; set; }

        public string TimeZone { get; set; }

        public int DelayTime { get; set; }

    }
}