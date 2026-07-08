using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtManager.Entities
{
    public class Person{
        public Guid Id {get; private set;} =  Guid.NewGuid();
        public required string Name {get; set;}
        public List<Transaction> Transactions { get; set; } = new();
        public int Age {get; set;}
        public Boolean IsDisabled {get; set;} = false;
    }
}