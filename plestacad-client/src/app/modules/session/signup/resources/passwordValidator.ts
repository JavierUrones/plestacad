import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

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