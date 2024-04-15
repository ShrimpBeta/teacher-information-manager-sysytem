import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function IsIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } {
      let value = control.value;
      return Number.isInteger(value) ? null : { 'integerInvalid': true };
    }
  }
}
