import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function PasswordMatchValidator(control: AbstractControl): ValidationErrors | null {
  let group = control as FormGroup;
  let password = group.get('password')?.value;
  let confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { 'passwordNotMatch': true };
}
