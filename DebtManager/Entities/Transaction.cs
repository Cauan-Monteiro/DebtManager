using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DebtManager.Entities
{
    public class Transaction
    {
        public Guid Id {get; private set;} =  Guid.NewGuid();
        public required Guid PersonId {get; set;}
        public Person ? Person {get; set;}
        public required string Description {get; set;}
        public decimal Amount {get; set;}
        public Category Type {get; set;}
    }
}