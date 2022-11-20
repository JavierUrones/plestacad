it('Crear trabajo académico con datos obligatorios válidos: título, descripción, curso, categoría sin invitar a ningún profesor ni estudiante.', function() {
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

    element(by.buttonText('Crear nuevo trabajo')).click();

    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    let titleWork = element(by.css("input[formControlName='title']"));
    titleWork.clear();
    titleWork.sendKeys('aa Test Trabajo Pruebas Integracion');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.css("textarea[formControlName='description']")).sendKeys('test');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.id("categorySelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Trabajo Fin de Grado')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.id("courseSelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', '2022')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.buttonText('Crear')).click();
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)

    browser.waitForAngularEnabled(false)
    element(by.css(".work-card")).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/trabajos/*"); //se comprueba que la url coincide con la de un trabajo académico.
    browser.waitForAngularEnabled(true)

  });

  it('Crear trabajo académico con datos obligatorios inválidos sin invitar a ningún profesor ni estudiante.', function() {
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

    element(by.buttonText('Crear nuevo trabajo')).click();

    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    let titleWork = element(by.css("input[formControlName='title']"));
    titleWork.clear();
    titleWork.sendKeys('');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.css("textarea[formControlName='description']")).sendKeys('');
    browser.waitForAngularEnabled(true)

  

    browser.waitForAngularEnabled(false)
    element(by.buttonText('Crear')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)

    let titleAddWork = element(by.id('title-add-work'));
    expect(titleAddWork.getText()).toBe('Crear nuevo trabajo académico.');//no se ha creado el trabajo.

  });

  it('Crear trabajo académico con datos obligatorios válidos: título, descripción, curso, categoría invitando a un profesor y a un estudiante.', function() {
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

    element(by.buttonText('Crear nuevo trabajo')).click();

    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    let titleWork = element(by.css("input[formControlName='title']"));
    titleWork.clear();
    titleWork.sendKeys('aa Test Trabajo Pruebas Integracion Con Invitacion');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.css("textarea[formControlName='description']")).sendKeys('test');
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.id("categorySelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Trabajo Fin de Grado')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.id("courseSelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', '2022')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.css("input[id='teacherSelect']")).click();
    //element(by.xpath('//*[@id="mat-option-57"]')).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'profesor@test.es | Profesor Profesor')).click();
    element(by.buttonText('Invitar profesor')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.css("input[id='studentSelect']")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'JohnDoe@email.es | John DoeProfessor')).click();
    element(by.buttonText('Invitar estudiante')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.buttonText('Crear')).click();
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)

    browser.waitForAngularEnabled(false)
    element(by.css(".work-card")).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    expect(browser.getCurrentUrl()).toMatch("http://localhost:4200/trabajos/*"); //se crea el trabajo académico.

  });


  it('Usuario propietario de trabajo académico modifica los datos del trabajo por unos válidos.', function() {
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
    element(by.css(".work-card")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)

    browser.waitForAngularEnabled(false)
    element(by.id('editInfoButton')).click();
    browser.waitForAngularEnabled(true)


    browser.waitForAngularEnabled(false)
    let titleWork = element(by.css("input[formControlName='title']"));
    titleWork.clear();
    titleWork.sendKeys('aaaTitulo editado');
    browser.waitForAngularEnabled(true);

    browser.waitForAngularEnabled(false)
    let descriptionWork = element(by.css("textarea[formControlName='description']"));
    descriptionWork.clear();
    descriptionWork.sendKeys("descripcion editada")
    browser.waitForAngularEnabled(true)
    
    browser.waitForAngularEnabled(false)
    element(by.id("categorySelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Trabajo Fin de Master')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.id("courseSelect")).click();
    element(by.cssContainingText('mat-option .mat-option-text', '2021')).click();
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    element(by.buttonText('Guardar cambios')).click();
    let titleWorkEdited =  element(by.css("input[formControlName='title']"));
    let descriptionWorkEdited =  element(by.css("textarea[formControlName='description']"));
    browser.waitForAngularEnabled(true)

    browser.waitForAngularEnabled(false)
    expect(titleWorkEdited.getAttribute('value')).toBe('aaaTitulo editado')
    expect(descriptionWorkEdited.getAttribute('value')).toBe('descripcion editada')

    browser.waitForAngularEnabled(true)



  });

  
  it('Usuario propietario de trabajo académico modifica los datos del trabajo por unos inválidos: título y descripción vacíos.', function() {
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
    element(by.css(".work-card")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)

    browser.waitForAngularEnabled(false)
    element(by.id('editInfoButton')).click();
    browser.waitForAngularEnabled(true)


    browser.waitForAngularEnabled(false)
    let titleWork = element(by.css("input[formControlName='title']"));
    titleWork.clear();
    titleWork.sendKeys('');
    browser.waitForAngularEnabled(true);

    browser.waitForAngularEnabled(false)
    let descriptionWork = element(by.css("textarea[formControlName='description']"));
    descriptionWork.clear();
    descriptionWork.sendKeys("")
    browser.waitForAngularEnabled(true)
    

    browser.waitForAngularEnabled(false)
    element(by.buttonText('Guardar cambios')).click();



  });

  
  it('Archivar/Desarchivar trabajo académico', function() {
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
    element(by.css(".work-card")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)

    browser.waitForAngularEnabled(false)
    element(by.id('classifyWorkButton')).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    element(by.id('confirmButton')).click();
    browser.waitForAngularEnabled(true)


    browser.sleep(1000)


    expect(element(by.buttonText('Desarchivar trabajo académico'))).not.toBeUndefined(); //se comprueba que el botón desarchivar trabajo académico ha aparecido.


    browser.waitForAngularEnabled(false)
    element(by.id('desclassifyWorkButton')).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    expect(element(by.buttonText('Archivar trabajo académico'))).not.toBeUndefined(); //se comprueba que el botón archivar trabajo académico ha aparecido.



  });

  





it('Usuario visualiza la lista de trabajos académicos.', function() {
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
  let work = element(by.css(".work-card"));
  browser.waitForAngularEnabled(true)

  expect(work).not.toBeUndefined(); //se comprueba que existen trabajos académicos en la lista de trabajos.

});

it('Filtrar trabajos académicos.', function() {
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
  element(by.id("workCategorySelector")).click();
  element(by.cssContainingText('mat-option .mat-option-text', 'Trabajos Fin de Grado')).click();
  browser.sleep(1000)
  let work = element(by.css(".work-category")).getText();
  expect(work).toEqual("Trabajo Fin de Grado");
  browser.waitForAngularEnabled(true)

  browser.waitForAngularEnabled(false)
  element(by.id("workCategorySelector")).click();
  element(by.cssContainingText('mat-option .mat-option-text', 'Trabajos Fin de Máster')).click();
  browser.sleep(1000)
  work = element(by.css(".work-category")).getText();
  expect(work).toEqual("Trabajo Fin de Master");
  browser.waitForAngularEnabled(true)

  browser.waitForAngularEnabled(false)
  element(by.id("workCategorySelector")).click();
  element(by.cssContainingText('mat-option .mat-option-text', 'Tésis Doctorales')).click();
  browser.sleep(1000)
  work = element(by.css(".work-category")).getText();
  expect(work).toEqual("Tésis doctoral");
  browser.waitForAngularEnabled(true)

  
  browser.waitForAngularEnabled(false)
  element(by.id("workCategorySelector")).click();
  element(by.cssContainingText('mat-option .mat-option-text', 'Todos')).click();
  browser.sleep(1000)

  browser.waitForAngularEnabled(true)

});



it('Eliminar trabajo académico', function() {
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
  element(by.css(".work-card")).click();
  browser.waitForAngularEnabled(true)

  browser.sleep(1000)

  browser.waitForAngularEnabled(false)
  element(by.id('deleteWorkButton')).click();
  browser.waitForAngularEnabled(true)

  browser.sleep(1000)


  browser.waitForAngularEnabled(false)
  element(by.id('confirmButton')).click();
  browser.waitForAngularEnabled(true)


  browser.sleep(1000)



  browser.waitForAngularEnabled(false)
  expect(browser.getCurrentUrl()).toBe('http://localhost:4200/trabajos'); //se comprueba que se ha redirigido a la lista de trabajos.
  browser.waitForAngularEnabled(true)
  
});

