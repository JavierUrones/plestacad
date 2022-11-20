it('Usuario visualiza su lista de notificaciones.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    var linkNotifications= element(by.id('notificationsOption'));
    linkNotifications.click();
    browser.sleep(15000)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/notificaciones');

    expect(element.all(by.className("notification")).count()).toBeGreaterThan(0);

    browser.waitForAngularEnabled(true)



});

it('Usuario elimina/marca como leído una notificación.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    var linkNotifications= element(by.id('notificationsOption'));
    linkNotifications.click();
    browser.sleep(10000)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/notificaciones');

    expect(element.all(by.className("markAsReadSingleButton")).count()).toBeGreaterThan(0);
    let buttonNotifications = element.all(by.className("markAsReadSingleButton"));
    buttonNotifications.get(0).click();
    browser.sleep(10000)
    expect(element.all(by.className("markAsReadSingleButton")).count()).toBeGreaterThan(0);


    browser.waitForAngularEnabled(true)


});


it('Usuario elimina/marca como leído todas las notificaciones.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    var linkNotifications= element(by.id('notificationsOption'));
    linkNotifications.click();
    browser.sleep(10000)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/notificaciones');

    expect(element.all(by.className("markAsReadSingleButton")).count()).toBeGreaterThan(0);
    let buttonNotifications = element.all(by.className("markAsReadSingleButton"));
    element(by.buttonText('Marcar todo como leído')).click();

    browser.sleep(10000) //esperamos mas segundos ya que la carga puede ser mas lenta debido al gran numero de notificaciones.
    buttonNotifications = element.all(by.className("markAsReadSingleButton"));
    expect(element.all(by.className("markAsReadSingleButton")).count()).toBe(0); //no existen mas notificaciones.


    browser.waitForAngularEnabled(true)


});

