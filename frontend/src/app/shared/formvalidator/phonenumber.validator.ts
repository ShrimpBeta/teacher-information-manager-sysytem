import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else {
      let phoneNumber = control.value;
      let isValidate = /^[1][3|4|5|7|8|9]\d{9}$/.test(phoneNumber);
      return isValidate ? null : { 'phoneNumberInvalid': true };
    }
  }
}
