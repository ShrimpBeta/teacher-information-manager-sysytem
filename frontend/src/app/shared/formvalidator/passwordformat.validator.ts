import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PasswordFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;
        const hasNumber = /\d/.test(password);
        // const hasUpper = /[A-Z]/.test(password);
        // const hasLower = /[a-z]/.test(password);
        // const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        return (hasNumber && hasLetter) ? null : { 'passwordInvalid': true };
    }
}