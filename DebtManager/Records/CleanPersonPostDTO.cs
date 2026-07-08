using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtManager.Records
{
    public record CleanPersonPostDTO(
        string Name,
        int Age
    ){}
}