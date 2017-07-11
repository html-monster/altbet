using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace AltBet.Admin.Models
{
    [Table("Category")]
    public class CategoryViewModel
    {
        [Key]        
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        public string Name { get; set; }
        
        public Guid ParentId { get; set; }

        [Required(ErrorMessage = "Url is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        public string Url { get; set; }

        [StringLength(50)]
        public string Icon { get; set; }
    }
}