# Plestacad

Esta aplicación es el cliente del proyecto desarrollado como Trabajo Fin De Grado del Grado en Ingeniería Informática del Software por Javier Urones Monteserín.


## Servidor de desarrollo

Para lanzar el servidor de desarrollo se debe ejecutar el comando `ng serve` o en su defecto `npm start`. Después de esto se debe navegar a la dirección `http://localhost:4200/`.
Esta aplicación se relanza automaticamente si se cambia alguno de los archivos de código fuente.


## Build

Para obtener hacer un build del proyecto debe ejecutarse el comando `ng build`. Este se almacenara en el directorio `dist/`.

## Pruebas de integración

Para lanzar las pruebas de integración se debe lanzar primero el driver de selenium `webdriver-manager start`. Posteriormente debe accederse al directorio `/test` y ejecutar el comando `protractor protractor.conf.js`.
