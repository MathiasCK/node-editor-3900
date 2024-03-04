namespace mymvc.Models {

    public class Position {
        public int X { get; set; }
        public int Y { get; set; }
    }
public class Element {
    public string? User { get; set; }
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Width { get; set; }
    // public Data? Data { get; set;}
    // public Position? Position { get; set; }
}
}