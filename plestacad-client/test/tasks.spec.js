
it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos válidos: fecha de fin e inicio especificadas.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    expect(element(by.id("no-tasks-header")).getText()).toEqual("No hay ninguna tarea creada todavía.");
    element(by.id('newTask')).click();
    browser.sleep(1000)

    element(by.css("input[formControlName='title']")).sendKeys('Test tarea integración');
    element(by.css("textarea[formControlName='description']")).sendKeys('Test tarea integración descripcion');

    let dateStart = element(by.css("input[formControlName='start']"));
    dateStart.sendKeys("01112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='end']"));
    dateEnd.sendKeys("02112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(1); //un elemento equivale a una tarea creada.


});

it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos válidos: fecha de fin e inicio sin especificar.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(1);
    element(by.id('newTask')).click();
    browser.sleep(1000)

    element(by.css("input[formControlName='title']")).sendKeys('Test tarea integración');
    element(by.css("textarea[formControlName='description']")).sendKeys('Test tarea integración descripcion');

    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(2); //dos tareas creadas


});

it('Usuario perteneciente a trabajo académico crea nueva tarea en dicho trabajo con datos inválidos: título sin especificar.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(2);
    element(by.id('newTask')).click();
    browser.sleep(1000)

    element(by.css("input[formControlName='title']")).sendKeys(' ');
    element(by.css("textarea[formControlName='description']")).sendKeys('Test tarea integración descripcion');

    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(2); //no se ha generado la nueva tarea.


});

it('Usuario perteneciente a trabajo académico visualiza la lista de tareas de dicho trabajo.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(2);


});

it('Usuario perteneciente a trabajo académico modifica tarea de dicho trabajo con datos válidos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(0).click();
    browser.sleep(1000);


    element(by.css("input[formControlName='title']")).clear().sendKeys('Test tarea integración editado');
    element(by.css("textarea[formControlName='description']")).clear().sendKeys('Test tarea integración descripcion editado');

    
    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000)
    settingsButtons.get(0).click();
    browser.sleep(1000);
    expect(element(by.css("input[formControlName='title']")).getAttribute('value')).toEqual('Test tarea integración editado');
    expect(element(by.css("textarea[formControlName='description']")).getAttribute('value')).toEqual('Test tarea integración descripcion editado');



});


it('Usuario perteneciente a trabajo académico modifica tarea con fecha de fin e inicio sin especificar con datos de fecha de inicio y fecha de fin especificados.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(1).click();
    browser.sleep(1000);

    let dateStart = element(by.css("input[formControlName='start']"));
    dateStart.sendKeys("03112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='end']"));
    dateEnd.sendKeys("04112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000)
    settingsButtons.get(1).click();
    browser.sleep(1000);

    dateEnd = element(by.css("input[formControlName='end']"));
    dateStart = element(by.css("input[formControlName='start']"));
    expect(dateStart.getAttribute("value")).toBe('2022-11-03T00:05');
    expect(dateEnd.getAttribute("value")).toBe('2022-11-04T00:05');




});


it('Usuario perteneciente a trabajo académico modifica tarea con fecha de fin e inicio especificadas con datos de fecha de inicio y fecha de fin sin especificar.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(0).click();
    browser.sleep(1000);

    let dateStart = element(by.css("input[formControlName='start']"));
    dateStart.click();

    dateStart.sendKeys(protractor.Key.DELETE);
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys(protractor.Key.DELETE);
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys(protractor.Key.DELETE);
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys(protractor.Key.DELETE);
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys(protractor.Key.DELETE);
    dateStart.sendKeys(protractor.Key.TAB);

    let dateEnd = element(by.css("input[formControlName='end']"));
    dateEnd.click();
    dateEnd.sendKeys(protractor.Key.DELETE);
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys(protractor.Key.DELETE);
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys(protractor.Key.DELETE);
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys(protractor.Key.DELETE);
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys(protractor.Key.DELETE);
    dateEnd.sendKeys(protractor.Key.TAB);
   browser.sleep(1000)

    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000);

    settingsButtons.get(0).click();
    browser.sleep(1000);

    dateEnd = element(by.css("input[formControlName='end']"));
    dateStart = element(by.css("input[formControlName='start']"));
    expect(dateStart.getAttribute("value")).toBe(''); //campos de fecha sin valor.
    expect(dateEnd.getAttribute("value")).toBe('');



});



it('Usuario perteneciente a trabajo académico modifica tarea de dicho trabajo con datos inválidos: título no especificado.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(1).click();
    browser.sleep(1000);

    element(by.css("input[formControlName='start']")).clear().sendKeys(" ");

    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000)
    settingsButtons.get(1).click();
    browser.sleep(1000);

    expect(element(by.css("input[formControlName='start']")).getAttribute("value")).not.toBe(" "); //se comprueba que el nombre no ha cambiado.

});
it('Usuario perteneciente a trabajo académico modifica tarea de dicho trabajo con datos inválidos: fecha de fin anterior a fecha de inicio.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(1).click();
    browser.sleep(1000);

    let dateStart = element(by.css("input[formControlName='start']"));
    dateStart.sendKeys("02112022");
    dateStart.sendKeys(protractor.Key.TAB);
    dateStart.sendKeys("0005");

    let dateEnd = element(by.css("input[formControlName='end']"));
    dateEnd.sendKeys("01112022");
    dateEnd.sendKeys(protractor.Key.TAB);
    dateEnd.sendKeys("0005");

    expect(element(by.id("errorDate")).getText()).toEqual("La fecha de fin no puede ser menor que la fecha de inicio de la tarea.");
});

it('Usuario perteneciente a trabajo académico clasifica una tarea de dicho trabajo desde el tablero de tareas a un nuevo apartado de clasificación.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let selectorList = element.all(by.id("selectorClassification"));
    selectorList.get(0).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Bloqueadas')).click();

    browser.sleep(1000);
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(0).click();
    browser.sleep(1000);

    expect(element(by.css("mat-select[formControlName='taskClassificatorId']")).getText()).toEqual("Bloqueadas");


});


it('Usuario perteneciente a trabajo académico clasifica una tarea desde el apartado de modificar tareas a un nuevo apartado de clasificación.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    settingsButtons.get(0).click();
    browser.sleep(1000);

    element(by.css("mat-select[formControlName='taskClassificatorId']")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'En progreso')).click();
    element(by.buttonText('Actualizar')).click();
    browser.sleep(1000);
    settingsButtons.get(0).click();
    browser.sleep(1000);
    expect(element(by.css("mat-select[formControlName='taskClassificatorId']")).getText()).toEqual("En progreso");


});


it('Usuario perteneciente a trabajo académico crea un apartado de clasificación de tareas con datos válidos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)
    expect(element.all(by.className("editableTitle")).count()).toEqual(4);
    element(by.id("newTaskClassificator")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(5);
    let newTaskClassificator = element.all(by.className("editableTitle")).get(4);
    newTaskClassificator.clear();
    browser.sleep(1000)
    newTaskClassificator.sendKeys("Test");
    browser.sleep(1000)
    newTaskClassificator.sendKeys(protractor.Key.TAB);
    browser.sleep(1000)


    expect(element.all(by.className("editableTitle")).get(4).getAttribute("value")).toEqual("NuevoTest");


});


it('Usuario perteneciente a trabajo académico crea un apartado de clasificación de tareas con datos inválidos: título no especificado.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)
    expect(element.all(by.className("editableTitle")).count()).toEqual(5);
    element(by.id("newTaskClassificator")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(6);
    let newTaskClassificator = element.all(by.className("editableTitle")).get(4);
    browser.sleep(1000)

    newTaskClassificator.clear();
    browser.sleep(1000)

    newTaskClassificator.sendKeys(" ")
    browser.sleep(1000)

    newTaskClassificator.sendKeys(protractor.Key.TAB)


    browser.sleep(2000)

    expect(element.all(by.className("editableTitle")).get(5).getAttribute("value")).toEqual("Nuevo"); //el nombre indicado no está vacío, sino que es igual a "Nuevo"


});


it('Usuario perteneciente a trabajo académico modifica un apartado de clasificación de tareas con datos válidos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)
    let taskClassificator = element.all(by.className("editableTitle")).get(4);
    browser.sleep(1000)

    taskClassificator.sendKeys("Editado")
    browser.sleep(1000)

    taskClassificator.sendKeys(protractor.Key.TAB)

    browser.sleep(2000)

    expect(element.all(by.className("editableTitle")).get(4).getAttribute("value")).toEqual("NuevoTest Editado");


});



it('Usuario perteneciente a trabajo académico modifica un apartado de clasificación de tareas con datos inválidos: título no especificado.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)
    let taskClassificator = element.all(by.className("editableTitle")).get(5);
    taskClassificator.clear();
    taskClassificator.sendKeys(" ")
    taskClassificator.sendKeys(protractor.Key.TAB)

    browser.sleep(2000)

    expect(element.all(by.className("editableTitle")).get(5).getAttribute("value")).toEqual("Nuevo ");

});

it('Usuario perteneciente a trabajo académico elimina un apartado de clasificación sin tareas clasificadas en él de dicho trabajo académico.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(6);


    // se eliminan los dos clasificadores creados anteriormente.
    element.all(by.className("optionMenu")).get(5).click();
    element(by.id("deleteTaskClassificator")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(5);

    taskClassificator = element.all(by.className("optionMenu")).get(4).click();
    element(by.id("deleteTaskClassificator")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(4);




});

it('Usuario perteneciente a trabajo académico elimina un apartado de clasificación con tareas clasificadas en él de dicho trabajo académico.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    element(by.cssContainingText('.mat-tab-label', "Tablero")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(4);


    // se elimina el apartado Nuevo que contiene las dos tareas creadas anteriormente.
    element.all(by.className("optionMenu")).get(0).click(); 
    element(by.id("deleteTaskClassificator")).click();
    browser.sleep(1000)

    expect(element.all(by.className("editableTitle")).count()).toEqual(3);


});


it('Usuario perteneciente a trabajo académico elimina tarea de dicho trabajo.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Tareas")).click();
    browser.sleep(1000)
    let settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(2); //quedan dos tareas.

    settingsButtons.get(0).click();
    browser.sleep(1000);

    element(by.id("deleteButton")).click()
    browser.sleep(1000);
    settingsButtons = element.all(by.cssContainingText('.mat-icon', "settings"));
    expect(settingsButtons.count()).toEqual(1); //queda una tarea.
    settingsButtons.get(0).click();

    browser.sleep(1000);
    element(by.id("deleteButton")).click()
    browser.sleep(1000);
    expect(element(by.id("no-tasks-header")).getText()).toEqual("No hay ninguna tarea creada todavía."); //no quedna tareas.


});
