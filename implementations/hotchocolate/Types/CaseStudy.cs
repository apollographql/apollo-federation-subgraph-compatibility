namespace Products;

public class CaseStudy
{

    public CaseStudy(string caseNumber, string? description)
    {
        CaseNumber = caseNumber;
        Description = description;
    }

    [ID]
    public string CaseNumber { get; }
    public string? Description { get; }

}
