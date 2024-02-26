namespace mymvc.Models {
public class Attribute {
    public string User { get; set; } = string.Empty;
    public DateTime Createtime { get; set; }
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty;
}
}