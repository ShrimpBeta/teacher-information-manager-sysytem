import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function CodeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } {
      let code = control.value;
      return /^\d{6}$/.test(code) ? null : { 'codeInvalid': true };
    }
  }
}
