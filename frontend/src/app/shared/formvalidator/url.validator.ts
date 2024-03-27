import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isURL } from "class-validator";

export function URLValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else {
      let url = control.value;
      let isValidate = isURL(url);
      return isValidate ? null : { 'urlInvalid': true };
    }
  }
}
