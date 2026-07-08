using Microsoft.AspNetCore.Mvc;
using DebtManager.Data;
using DebtManager.Entities;
using System;

namespace DebtManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        // Database context to interact with the database
        private readonly AppDbContext _context;

        // Constructor to inject the database context
        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Get all transactions on the database
        [HttpGet]
        public IActionResult GetTransactions()
        {
            var Transactions = _context.Transactions.ToList();
            return Ok(Transactions);
        }

        // POST: Create a new transaction in the database
        [HttpPost]
        public IActionResult CreateTransaction([FromBody] Transaction transaction)
        {   
            if (transaction.Amount < 0)
            {
                transaction.Amount = Math.Abs(transaction.Amount);
            }
            
            try
            {
                // Check if the person exists in the database
                var person = _context.People.Find(transaction.PersonId);
                if (person == null)
                {
                    return NotFound($"Person with Id {transaction.PersonId} not found.");
                }

                // Assign the person to the transaction
                transaction.Person = person;

                if (person.Age < 18 && transaction.Type == Category.REVENUE)
                {
                    return BadRequest("Person is under 18 and cannot create a revenue transaction.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while processing the request: {ex.Message}");
            }
            _context.Transactions.Add(transaction);
            _context.SaveChanges();
            return Ok(transaction);
        }


    }
}