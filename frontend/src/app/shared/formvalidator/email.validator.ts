import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isEmail } from "class-validator";

export function EmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else {
      let email = control.value;
      let isValidate = isEmail(email);
      return isValidate ? null : { 'emailInvalid': true };
    }
  }
}
