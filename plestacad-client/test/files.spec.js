it('Visualizar lista de directorios.', function() {
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
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    let createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toBeGreaterThan(0); //se comprueba uqe existe al menos un boton de crear directorio, por lo que se están visualizando los directorios.


  });

it('Usuario perteneciente a trabajo académico crea directorio con nivel de profundidad menor que cinco dentro del árbol de directorios.', function() {
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
    
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)
    let createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(1);

    createButtonList.get(0).click();

    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test');
    element(by.buttonText('Crear')).click();

    browser.sleep(1000)


    createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toBeGreaterThan(1); //hay una carpeta más.
    browser.waitForAngularEnabled(true)


  });
 
  
it('Usuario perteneciente a trabajo académico crea directorio con nivel de profundidad mayor o igual a cinco dentro del árbol de directorios.', function() {
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
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)


    let createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(2);
    createButtonList.get(1).click();
    browser.sleep(1000)
    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test 2');
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(3);
    createButtonList.get(2).click();
    browser.sleep(1000)
    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test 3');
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(4);
    createButtonList.get(3).click();
    browser.sleep(1000)
    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test 4');
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(5);
    createButtonList.get(4).click();
    browser.sleep(1000)
    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test 5');
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)


    expect(element(by.id("errorCreateDirectory")).getText()).toBe("No se puede crear el directorio solicitado.")
  
  });
 

  it('Usuario perteneciente a trabajo académico crea directorio con el mismo nombre que otro en el mismo nivel de la jerarquía de directorios.', function() {
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
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)


    let createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    createButtonList.get(0).click();
    expect(createButtonList.count()).toEqual(5);

    browser.sleep(1000)
    element(by.id("nameDirectoryInput")).sendKeys('Integracion Test');
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)
    expect(element(by.id("errorCreateDirectory")).getText()).toBe("No se puede crear el directorio solicitado.")
    createButtonList = element.all(by.cssContainingText('.mat-icon', "create_new_folder"));
    expect(createButtonList.count()).toEqual(5);

  
  }); 

  it('Usuario perteneciente a trabajo académico elimina directorio vacío.', function() {
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
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)


    let deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    expect(deleteButtonList.count()).toEqual(4);

    deleteButtonList.get(3).click(); //es un index menos ya que la carpeta raiz no tiene boton eliminar.
    browser.sleep(1000)
    deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    browser.sleep(1000)
    expect(deleteButtonList.count()).toEqual(3); //hay un directorio menos

  
  }); 

  it('Usuario perteneciente a trabajo académico elimina directorio con elementos dentro de él.', function() {
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
    element(by.cssContainingText('.mat-tab-label', "Archivos")).click();
    browser.waitForAngularEnabled(true)

    browser.sleep(1000)


    browser.waitForAngularEnabled(false)


    let deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    expect(deleteButtonList.count()).toEqual(3);

    deleteButtonList.get(0).click(); //directorio que contiene otros directorios.
    browser.sleep(1000)
    deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    browser.sleep(1000)
    expect(deleteButtonList.count()).toEqual(3); //hay los mismos directorios.


    //se eliminan el resto de directorios para dejar limpio el trabajo académico.
    deleteButtonList.get(2).click();
    browser.sleep(1000)
    deleteButtonList.get(1).click();
    browser.sleep(1000)

    deleteButtonList.get(0).click();

  }); 
