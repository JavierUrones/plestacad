import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Valida que el campo de contraseña y repetir contraseña tenga el mismo valor
 * @param control - control para obtener los valores del formulario
 * @returns true si el valor de la contraseña es el mismo que el de repetir contraseña
 * @returns false si el valor de la contraseña es distinto que el de repetir contraseña
 */
export const confirmPasswordValidator: ValidatorFn | ValidatorFn[] = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('repeatPassword')?.value;
    if( password!== confirmPassword) {
        return { invalidPassword: true };
      }
    return null;
  };