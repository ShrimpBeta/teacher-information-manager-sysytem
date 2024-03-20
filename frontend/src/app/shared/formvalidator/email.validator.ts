
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isEmail } from "class-validator";

export function EmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const email = control.value;
        const isValidate = isEmail(email);
        return isValidate ? null : { 'emailInvalid': true };
    }
}
