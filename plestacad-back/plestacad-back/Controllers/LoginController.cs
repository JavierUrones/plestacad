using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using plestacad_back.Authentication;
using plestacad_back.Models;

namespace plestacad_back.Controllers
{
    [Route("api")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<Login> _logger;
        private readonly IJwtAuthenticationHandlerService _authenticationService;

        public LoginController(ILogger<Login> logger, IJwtAuthenticationHandlerService authenticationService)
        {
            _authenticationService = authenticationService;
            _logger = logger;
        }
        
        // GET
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("auth")]
        public IActionResult Authenticate([FromBody] Login loginInfo)
        {
            var token = _authenticationService.Authenticate(loginInfo.Username, loginInfo.Password);

            if (token == null)
            {
                return Unauthorized();
            }
            
            //TO DO: Comprobar en base de datos si es correcto.
            return Ok(new {Token = token});
        }
}
}