namespace mymvc.Models {
    public enum AspectType {
        Function,
        Product,
        Location,
        Empty
    }

    public class ForeignKeys {
        public  string id = string.Empty;
    }
    public class Data {
        public AspectType Aspect { get; set; }
        public bool? HasTerminal { get; set; }
        public List <ForeignKeys>? Terminals { get; set; }
        public bool? TerminalOf { get; set; }
        public string TransfersTo { get; set; } = string.Empty;
        public string TransferedBy { get; set; } = string.Empty;
        public List <ForeignKeys>? ConnectedTo { get; set; }
        public bool? HasDirectPart { get; set; }
        public List <ForeignKeys>? DirectParts { get; set; }
        public string DirectPartOf { get; set; } = string.Empty;
        public List <ForeignKeys>? FulfilledBy { get; set; }
        public List <ForeignKeys>? Fullfills { get; set; }
        public string id = string.Empty;
        public string label = string.Empty;
        public string type = string.Empty;
        public int createdAt;
        public int updatedAt; 
        public string customName = string.Empty;
    }
}