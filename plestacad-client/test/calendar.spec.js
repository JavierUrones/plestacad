
it('Usuario perteneciente a trabajo académico crea un evento con datos válidos en dicho trabajo académico: fecha de inicio anterior a fecha de fin.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(0);

    element(by.id('newEvent')).click();

    browser.sleep(1000)

    element(by.css("input[formControlName='title']")).sendKeys('Test integración');
    element(by.css("textarea[formControlName='description']")).sendKeys('Test integración descripcion');

    let dateStart = element(by.css("input[formControlName='pickerStart']"));
    dateStart.sendKeys("01112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='pickerEnd']"));
    dateEnd.sendKeys("02112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    browser.sleep(1000)
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    expect(element.all(by.className("fc-event-container")).count()).toEqual(1);



});

it('Usuario perteneciente a trabajo académico crea un evento con datos inválidos: fecha de inicio posterior a fecha de fin.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)

    element(by.id('newEvent')).click();
    browser.sleep(1000)

    element(by.css("input[formControlName='title']")).sendKeys('Test integración');
    element(by.css("textarea[formControlName='description']")).sendKeys('Test integración descripcion 2');

    let dateStart = element(by.css("input[formControlName='pickerStart']"));
    dateStart.sendKeys("02112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='pickerEnd']"));
    dateEnd.sendKeys("01112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    browser.sleep(1000)
    expect(element(by.id("errorDate")).getText()).toEqual("La fecha de fin no puede ser menor que la fecha de inicio del evento.");



});

it('Visualizar eventos del calendario', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)

    expect(element.all(by.className("fc-event-container")).count()).toEqual(1); //hay un evento creado en el calendario, es el que se visualiza.

});

it('Filtrar eventos del calendario: eventos, tareas.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)
    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Eventos')).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(1);

    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Tareas')).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(0);

    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Todos')).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(1);


});




it('Usuario perteneciente a trabajo académico modifica un evento con datos inválidos: fecha de inicio posterior a fecha de fin.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)

    expect(element.all(by.className("fc-event-container")).count()).toEqual(1); //hay un evento creado
    let eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000)

    
    element(by.css("input[formControlName='title']")).clear().sendKeys('Test integración editado');
    element(by.css("textarea[formControlName='description']")).clear().sendKeys('Test integración descripcion editado');

    let dateStart = element(by.css("input[formControlName='pickerStart']"));
    dateStart.clear();
    dateStart.sendKeys("03112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='pickerEnd']"));
    dateEnd.clear();
    dateEnd.sendKeys("04112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    browser.sleep(1000)

    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000);

    eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000);
    expect(element(by.css("input[formControlName='title']")).getAttribute('value')).toBe('Test integración editado')
    expect(element(by.css("textarea[formControlName='description']")).getAttribute('value')).toBe('Test integración descripcion editado')
    expect(element(by.css("input[formControlName='pickerStart']")).getAttribute('value')).toBe('2022-11-03T00:05')
    expect(element(by.css("input[formControlName='pickerEnd']")).getAttribute('value')).toBe('2022-11-04T00:05')





});

it('Usuario perteneciente a trabajo académico modifica un evento con datos válidos en dicho trabajo académico: titulo, descripción, fecha de inicio anterior a fecha de fin.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)

    expect(element.all(by.className("fc-event-container")).count()).toEqual(1); //hay un evento creado
    let eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000)

    
    element(by.css("input[formControlName='title']")).clear().sendKeys('Test integración editado');
    element(by.css("textarea[formControlName='description']")).clear().sendKeys('Test integración descripcion editado');

    let dateStart = element(by.css("input[formControlName='pickerStart']"));
    dateStart.clear();
    dateStart.sendKeys("03112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='pickerEnd']"));
    dateEnd.clear();
    dateEnd.sendKeys("02112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    browser.sleep(1000)
    expect(element(by.id("errorDate")).getText()).toEqual("La fecha de fin no puede ser menor que la fecha de inicio del evento.");


});

it('Usuario perteneciente a trabajo académico modifica un evento con datos inválidos: título.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)

    expect(element.all(by.className("fc-event-container")).count()).toEqual(1); //hay un evento creado
    let eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000)

    
    element(by.css("input[formControlName='title']")).clear().sendKeys(' ');
    browser.sleep(1000)

    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000)

    eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000)

    
    expect(element(by.css("input[formControlName='title']")).getAttribute('value')).not.toEqual(" ");

});


it('Usuario perteneciente a trabajo académico elimina un evento del calendario.', function () {
    browser.get('http://localhost:4200/login');

    let title = element(by.id('loginTitle'));
    expect(title.getText()).toBe('Inicia sesión');

    element(by.css("input[formControlName='email']")).sendKeys('javierum98@gmail.com');
    element(by.css("input[formControlName='password']")).sendKeys('aaaaaaaaa');


    element(by.buttonText('Entrar')).click();

    browser.sleep(1000)
    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    browser.sleep(1000)
    let work = element.all(by.css(".work-card")).get(0).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.cssContainingText('.mat-tab-label', "Calendario")).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(1); //hay un evento creado
    let eventsList = element.all(by.className("fc-event-container"))
    eventsList.get(0).click();
    browser.sleep(1000)
    element(by.id("deleteButton")).click();
    browser.sleep(1000)
    expect(element.all(by.className("fc-event-container")).count()).toEqual(0); //ya no hay eventos creados



});