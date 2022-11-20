it('Visualizar información del perfil', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)
    var linkProfile = element(by.id('profileOption'));
    browser.waitForAngularEnabled(false)
    linkProfile.click();
    browser.waitForAngularEnabled(true)
    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/perfil');
    browser.waitForAngularEnabled(true)

    var title = element(by.id('header-details'));
    browser.waitForAngularEnabled(false)

    expect(title.getText()).toBe('Foto de perfil');
    browser.waitForAngularEnabled(true)

})


  it('Introducir nombre y apellidos inválidos.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)
    var linkProfile = element(by.id('profileOption'));
    browser.waitForAngularEnabled(false)
    linkProfile.click();
    browser.waitForAngularEnabled(true)
    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/perfil');
    browser.waitForAngularEnabled(true)

    
    browser.waitForAngularEnabled(false)
    let nameForm = element(by.css("input[formControlName='name']"));
    nameForm.clear();
    nameForm.sendKeys(' ');
    let surnameForm = element(by.css("input[formControlName='surname']"));
    surnameForm.clear();
    surnameForm.sendKeys(' ');
    element(by.buttonText('Actualizar datos')).click();


    var errorName = element(by.id('dataError'));

    expect(errorName.getText()).toBe('Error en los datos introducidos.');
    browser.waitForAngularEnabled(true)

  });

  it('Introducir nombre y apellidos válidos.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)
    var linkProfile = element(by.id('profileOption'));
    browser.waitForAngularEnabled(false)
    linkProfile.click();
    browser.waitForAngularEnabled(true)
    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/perfil');
    browser.waitForAngularEnabled(true)

    
    browser.waitForAngularEnabled(false)
    let nameForm = element(by.css("input[formControlName='name']"));
    nameForm.clear();
    nameForm.sendKeys('JavierActualizado');
    let surnameForm = element(by.css("input[formControlName='surname']"));
    surnameForm.clear();
    surnameForm.sendKeys('UronesActualizado');
    element(by.buttonText('Actualizar datos')).click();

    browser.sleep(1000)

    var success = element(by.id('dataSuccess'));

    expect(success.getText()).toBe('Información actualizada con éxito.');
    browser.waitForAngularEnabled(true)

  });


  it('Modificar contraseña por una válida.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)
    var linkProfile = element(by.id('profileOption'));
    browser.waitForAngularEnabled(false)
    linkProfile.click();
    browser.waitForAngularEnabled(true)
    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/perfil');
    browser.waitForAngularEnabled(true)

    
    browser.waitForAngularEnabled(false)
    let currentPassword = element(by.css("input[formControlName='currentPassword']"));
    currentPassword.clear();
    currentPassword.sendKeys('aaaaaaaaa');
    let password = element(by.css("input[formControlName='password']"));
    password.clear();
    password.sendKeys('aaaaaaaaa');
    let repeatPassword = element(by.css("input[formControlName='repeatPassword']"));
    repeatPassword.clear();
    repeatPassword.sendKeys('aaaaaaaaa');
    element(by.buttonText('Actualizar contraseña')).click();

    browser.sleep(1000)

    var success = element(by.id('passwordSuccess'));

    expect(success.getText()).toBe('Contraseña actualizada con éxito.');
    browser.waitForAngularEnabled(true)

  });

  it('Modificar contraseña por una no válida.', function() {
    browser.get('http://localhost:4200/login');

    title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)
    var linkProfile = element(by.id('profileOption'));
    browser.waitForAngularEnabled(false)
    linkProfile.click();
    browser.waitForAngularEnabled(true)
    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/perfil');
    browser.waitForAngularEnabled(true)

    
    browser.waitForAngularEnabled(false)
    let currentPassword = element(by.css("input[formControlName='currentPassword']"));
    currentPassword.clear();
    currentPassword.sendKeys('aaaaaaaaa');
    let password = element(by.css("input[formControlName='password']"));
    password.clear();
    password.sendKeys('aaaaa');
    let repeatPassword = element(by.css("input[formControlName='repeatPassword']"));
    repeatPassword.clear();
    repeatPassword.sendKeys('aaaaaaaaa');
    element(by.buttonText('Actualizar contraseña')).click();

    browser.sleep(1000)

    var error = element(by.id('passwordLengthError'));
    var errorMatch = element(by.id('passwordMatchError'));
    expect(error.getText()).toBe('Contraseña demasiado corta.');
    expect(errorMatch.getText()).toBe('Las contraseñas no coinciden.');

    browser.waitForAngularEnabled(true)

  });


