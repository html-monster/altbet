using System;

namespace AltBet.Admin.Models
{
    public class PlayerViewModel
    {
        public Guid Id { get; set; }
        public string Position { get; set; }
        public string Team { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public int Index { get; set; }
        public int PositionQuantity { get; set; }
    }
}