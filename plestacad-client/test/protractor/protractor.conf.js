//para ejecutar todos los test a la vez, suele dar error por culpa de la sincronización con selenium.
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['../session.spec.js', '../profile.spec.js', '../works.spec.js', '../files.spec.js', '../posts.spec.js', '../calendar.spec.js', '../tasks.spec.js', '../notifications.spec.js'],
    logLevel: 'ERROR'

  };