it('Usuario perteneciente a trabajo académico visualiza la lista de temas del trabajo académico.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)

    expect(element(by.id("no-posts-header")).getText()).toBe("No hay ningún tema publicado todavía.")

});


it('Usuario perteneciente a trabajo académico crea tema con título y contenido válidos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(0);

    element(by.id("newPost")).click();

    browser.sleep(1000)

    element(by.className("ql-editor")).sendKeys("Contenido de prueba");
    browser.sleep(1000)
    element(by.css("input[formControlName='title']")).sendKeys("Titulo post integracion");
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    expect(element.all(by.className("post-card")).count()).toEqual(1);

    browser.waitForAngularEnabled(true)


});

it('Usuario perteneciente a trabajo académico crea tema con título y contenido inválidos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);
    element(by.id("newPost")).click();

    browser.sleep(1000)

    element(by.className("ql-editor")).sendKeys(" ");
    browser.sleep(1000)
    element(by.css("input[formControlName='title']")).sendKeys(" ");
    element(by.buttonText('Crear')).click();
    browser.sleep(1000)

    expect(element.all(by.className("post-card")).count()).toEqual(1); //no se crea el nuevo post, sigue habiendo los mismos.

    browser.waitForAngularEnabled(true)


});

it('Usuario perteneciente a trabajo académico marca un tema no favorito como favorito. / Usuario perteneciente a trabajo académico marca un tema no favorito como favorito.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);
    expect(element.all(by.id("isFavorite")).count()).toEqual(0);
    expect(element.all(by.id("isNotFavorite")).count()).toEqual(1);

    let favoriteButtonList = element.all(by.cssContainingText('.mat-icon', "favorite_border"));
    favoriteButtonList.get(0).click()
    browser.sleep(1000)
    expect(element.all(by.id("isFavorite")).count()).toEqual(1);
    expect(element.all(by.id("isNotFavorite")).count()).toEqual(0);

    favoriteButtonList = element.all(by.cssContainingText('.mat-icon', "favorite"));
    favoriteButtonList.get(0).click()
    browser.sleep(1000)
    expect(element.all(by.id("isFavorite")).count()).toEqual(0);
    expect(element.all(by.id("isNotFavorite")).count()).toEqual(1);

    browser.waitForAngularEnabled(true)


});
it('Filtrar temas: más recientes, menos recientes, favoritos.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Más recientes')).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Menos recientes')).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element(by.id("filterSelector")).click();
    element(by.cssContainingText('mat-option .mat-option-text', 'Favoritos')).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);



});

it('Usuario perteneciente a trabajo académico crea respuesta a un tema con contenido válido.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element.all(by.className("navigatorLink")).get(0).click(); // se accede al tema
    browser.sleep(1000) 

    expect(element.all(by.className("interaction")).count()).toEqual(0);


    element(by.className("ql-editor")).sendKeys("Prueba comentario");
    browser.sleep(1000)
    element(by.buttonText('Comentar')).click();
    browser.sleep(1000)

    expect(element.all(by.className("interaction")).count()).toEqual(1);


});

it('Usuario perteneciente a trabajo académico crea respuesta a un tema con contenido inválido: contenido vacío.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element.all(by.className("navigatorLink")).get(0).click(); // se accede al tema
    browser.sleep(2000) 

    expect(element.all(by.className("interaction")).count()).toEqual(1);


    element(by.className("ql-editor")).sendKeys("    ");
    browser.sleep(1000)
    element(by.buttonText('Comentar')).click();
    browser.sleep(1000)

    expect(element.all(by.className("interaction")).count()).toEqual(1); //sigue habiendo el mismo número de interacciones.

});


it('Usuario perteneciente a trabajo académico elimina respuesta creada por el propio usuario a un tema.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);

    element.all(by.className("navigatorLink")).get(0).click(); // se accede al tema
    browser.sleep(1000) 

    expect(element.all(by.className("interaction")).count()).toEqual(1);


    let deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    deleteButtonList.get(0).click()
    browser.sleep(1000)
    element(by.id('confirmButton')).click();
    browser.sleep(1000)

    expect(element.all(by.className("interaction")).count()).toEqual(0); //ya no hay respuestas

    browser.sleep(1000)


});


it('Usuario perteneciente a trabajo académico elimina tema siendo el creador del tema.', function () {
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
    element(by.cssContainingText('.mat-tab-label', "Foro")).click();
    browser.sleep(1000)
    expect(element.all(by.className("post-card")).count()).toEqual(1);
    let deleteButtonList = element.all(by.cssContainingText('.mat-icon', "delete"));
    deleteButtonList.get(0).click();
    browser.sleep(1000)
    element(by.id('confirmButton')).click();
    browser.sleep(1000)

    expect(element.all(by.className("post-card")).count()).toEqual(0);



});


