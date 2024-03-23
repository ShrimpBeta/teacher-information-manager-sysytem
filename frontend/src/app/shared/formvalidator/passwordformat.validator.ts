import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PasswordFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } {
      let password = control.value;
      let hasNumber = /\d/.test(password);
      // let hasUpper = /[A-Z]/.test(password);
      // let hasLower = /[a-z]/.test(password);
      // let hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      let hasLetter = /[a-zA-Z]/.test(password);
      return (hasNumber && hasLetter) ? null : { 'passwordInvalid': true };
    }
  }
}
