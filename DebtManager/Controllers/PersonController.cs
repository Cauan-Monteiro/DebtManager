using Microsoft.AspNetCore.Mvc;
using DebtManager.Data;
using DebtManager.Entities;
using DebtManager.Records;

namespace DebtManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        // Database context to interact with the database
        private readonly AppDbContext _context;

        // Constructor to inject the database context
        public PersonController(AppDbContext context)
        {
            _context = context;
        }
        
        // GET: Get all transactions for a specific person by Id
        [HttpGet("transaction/{id}")]
        public IActionResult GetTransactionsByPersonId(Guid id)
        {
            var transactions = _context.Transactions.Where(t => t.PersonId == id).ToList();
            if (transactions == null ){return NotFound();}
            if ( transactions.Count == 0){return Content("No transactions yet!");}
            return Ok(transactions);
        }

        // GET: All people registered in the database
        [HttpGet]
        public IActionResult GetPeople()
        {
            var People = _context.People.Where(t => !t.IsDisabled).Select(p => new CleanPersonGetDTO(
                p.Id,
                p.Name,
                p.Age,
                p.IsDisabled
            )).ToList();
            return Ok(People);
        }

        // GET: Get some specific datas of a person by Id
        [HttpGet("totals")]
        public IActionResult GetPersonTotals()
        {

            if (!_context.People.Any())
            {
                return Content("No people yet!");
            }

            return Ok(_context.People.Where(t => !t.IsDisabled).Select(p => new PersonCompleteDTO(
                p.Id,
                p.Name,
                p.Age,
                p.Transactions.Sum(t => t.Type == Category.EXPENSE ? t.Amount : 0),
                p.Transactions.Sum(t => t.Type == Category.REVENUE ? t.Amount : 0),
                p.Transactions.Sum(t => t.Type == Category.REVENUE ? t.Amount : 0) - p.Transactions.Sum(t => t.Type == Category.EXPENSE ? t.Amount : 0)
            )).ToList());
        }

        [HttpGet("people_totals")]
        public IActionResult GetPeopleTotals()
        {
            var peopleList = _context.People.Where(t => !t.IsDisabled).Select(p => new PersonCompleteDTO(
                p.Id,
                p.Name,
                p.Age,
                p.Transactions.Sum(t => t.Type == Category.EXPENSE ? t.Amount : 0),
                p.Transactions.Sum(t => t.Type == Category.REVENUE ? t.Amount : 0),
                p.Transactions.Sum(t => t.Type == Category.REVENUE ? t.Amount : 0) - p.Transactions.Sum(t => t.Type == Category.EXPENSE ? t.Amount : 0)
            )).ToList();

            if (peopleList.Count == 0)
            {
                return Content("No people yet!");
            }
            // Console.WriteLine(string.Join(", ", peopleList));  // Debugging line to print the peopleList to the console
            return Ok(new CompleteReportDTO(
                peopleList,
                peopleList.Sum(p => p.TotalExpenses),
                peopleList.Sum(p => p.TotalRevenues),
                peopleList.Sum(p => p.TotalBalance)
            ));
        }

        // POST: Create a new person in the database
        [HttpPost]
        public IActionResult CreatePerson(Person person)
        {
            // Input validation
            if (person == null)
            {
                return BadRequest("Person data is null.");
            }
            var name = person.Name.Trim();
            if (name.Length < 3 || name.Length > 50)
            {
                return BadRequest("Name feels like it is too short or too long.");
            }
            if (person.Age < 0 || person.Age > 120)
            {
                return BadRequest("Age is not valid.");
            }

            try{
                _context.People.Add(person);
                _context.SaveChanges();
                var People = new CleanPersonPostDTO(
                    person.Name,
                    person.Age);
                return Ok(People);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while creating the person. Message: " + ex.Message);
            }
        }

        // DELETE: Delete a person from the database by Id
        [HttpDelete("{id}")]
        public IActionResult DeletePerson(Guid id)
        {
            // Find the person by Id on the database, if not found return NotFound
            var Person = _context.People.Find(id);
            if (Person == null)
            {
                return NotFound();
            }

            Person.Transactions.Select(t => t.Id).ToList().ForEach(tId =>
            {
                var transaction = _context.Transactions.Find(tId);
                if (transaction != null)
                {
                    _context.Transactions.Remove(transaction);
                }
            });

            // Person.IsDisabled = true;
            // _context.People.Update(Person);      // SafeDelete
            // _context.SaveChanges();
            // return Content("Person disabled successfully!");

            _context.People.Remove(Person);
            _context.SaveChanges();
            return Content("Person deleted successfully!");
        }

        // SAFE DELETE: Disable a person from the database by Id
        [HttpDelete("{id}/disable")]
        public IActionResult SafeDeletePerson(Guid id)
        {
            // Find the person by Id on the database, if not found return NotFound
            var Person = _context.People.Find(id);
            if (Person == null)
            {
                return NotFound();
            }

            Person.Transactions.Select(t => t.Id).ToList().ForEach(tId =>
            {
                var transaction = _context.Transactions.Find(tId);
                if (transaction != null)
                {
                    _context.Transactions.Remove(transaction);
                }
            });

            Person.IsDisabled = true;
            _context.People.Update(Person);
            _context.SaveChanges();
            return Content("Person disabled successfully!");
        }
    }
}