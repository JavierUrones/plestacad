module.exports = class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError"; 
    }
  }
  
module.exports = class EmailRepeatError extends Error {
    constructor(message) {
      super(message);
      this.name = "EmailRepeatError"; 
    }
  }  

