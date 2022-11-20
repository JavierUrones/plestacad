
function generateStringRandom(length) {
  var res           = '';
  var chars       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charsLength = chars.length;
  for ( var i = 0; i < length; i++ ) {
      res += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return res;
}

var userRegisteredEmail;
describe('Registrar usuario con nombre y apellidos válidos y correo electrónico no utilizado.', function() {
  it('Registrarse con datos válidos', function() {
    browser.get('http://localhost:4200/signup');

    title = element(by.id('registerTitle'));
    expect(title.getText()).toBe('Crea tu cuenta ahora');
    userRegisteredEmail = generateStringRandom(4);
    element(by.css("input[formControlName='name']")).sendKeys('UserTest');
    element(by.css("input[formControlName='surname']")).sendKeys('UserTest');
    element(by.css("input[formControlName='email']")).sendKeys('usertest'+ userRegisteredEmail +'@email.es');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaaa');
    element(by.css("input[formControlName='repeatPassword']")).sendKeys('aaaaaaaaaa');


    element(by.buttonText('Crear mi cuenta')).click();
    browser.sleep(1000)

    var succesfullText = element(by.id('succesfullText'));
    expect(succesfullText.getText()).toBe('Gracias por registrarte, comprueba la bandeja de entrada de tu correo electrónico para verificar tu cuenta.');

  });

  it('Registrar usuario con nombre y apellidos válidos y correo electrónico ya utilizado.', function() {
    browser.get('http://localhost:4200/signup');

    title = element(by.id('registerTitle'));
    expect(title.getText()).toBe('Crea tu cuenta ahora');

    element(by.css("input[formControlName='name']")).sendKeys('UserTest');
    element(by.css("input[formControlName='surname']")).sendKeys('UserTest');
    element(by.css("input[formControlName='email']")).sendKeys('usertest'+ userRegisteredEmail +'@email.es');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaaa');
    element(by.css("input[formControlName='repeatPassword']")).sendKeys('aaaaaaaaaa');


    element(by.buttonText('Crear mi cuenta')).click();
    browser.sleep(1000)

    var errorRegister = element(by.id('errorRegister'));
    expect(errorRegister.getText()).toBe('Ya existe una cuenta registrada con el email indicado.');

  });

  it('Registrar usuario con nombre y apellidos no válidos y correo electrónico no utilizado.', function() {
    browser.get('http://localhost:4200/signup');

    title = element(by.id('registerTitle'));
    expect(title.getText()).toBe('Crea tu cuenta ahora');

    element(by.css("input[formControlName='name']")).sendKeys('');
    element(by.css("input[formControlName='surname']")).sendKeys('');
    element(by.css("input[formControlName='email']")).sendKeys('usertest'+ generateStringRandom(4) +'@email.es');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaaa');
    element(by.css("input[formControlName='repeatPassword']")).sendKeys('aaaaaaaaaa');


    element(by.buttonText('Crear mi cuenta')).click();

    var errorName = element(by.id('errorName'));
    expect(errorName.getText()).toBe('Indica un nombre váĺido');
    var errorSurname = element(by.id('errorSurname'));
    expect(errorSurname.getText()).toBe('Indica un apellido váĺido');

  });

  it('Registrar usuario con datos válidos excepto contraseña no indicada.', function() {
    browser.get('http://localhost:4200/signup');

    title = element(by.id('registerTitle'));
    expect(title.getText()).toBe('Crea tu cuenta ahora');

    element(by.css("input[formControlName='name']")).sendKeys('a');
    element(by.css("input[formControlName='surname']")).sendKeys('a');
    element(by.css("input[formControlName='email']")).sendKeys('usertest'+ generateStringRandom(4) +'@email.es');
    element(by.css("input[formControlName='password']")).sendKeys('');
    element(by.css("input[formControlName='repeatPassword']")).sendKeys('');


    element(by.buttonText('Crear mi cuenta')).click();

    var errorPasswordRequired = element(by.id('errorPasswordRequired'));
    expect(errorPasswordRequired.getText()).toBe('Contraseña requerida');

  });


  it('Iniciar sesión con correo electrónico y contraseña válidos.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(3000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)
  });

  it('Iniciar sesión con correo electrónico y contraseña válidos.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('noexisto@noexisto.es');
    element(by.css("input[formControlName='password']")).sendKeys('bbbbbbbbb');


    element(by.buttonText('Entrar')).click();

    browser.sleep(3000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/login');
    browser.waitForAngularEnabled(true)
  });











});
  
  