using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using plestacad_back.Models;

namespace plestacad_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private List<User> users = new List<User>();
        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            users.Add(new User {Name = "Javier"});
            users.Add(new User {Name = "Jorge"});
            users.Add(new User {Name = "Miguelito"});

        }

        [HttpGet]
        [Authorize]
        public IEnumerable<User> Get()
        {
            return users.ToArray();
        }
    }
}