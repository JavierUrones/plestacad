import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const dateEndValidator: ValidatorFn | ValidatorFn[] = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const endDate = control.get('pickerEnd')?.value;
    const startDate = control.get('pickerStart')?.value;

    if( endDate.getTime() <= startDate.getTime()) {
        return { invalidEndDate: true };
      }
    return null;
  };