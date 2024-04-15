import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function StartEndValidator(control: AbstractControl): ValidationErrors | null {
  let group = control as FormGroup;
  let start = group.get('start')?.value;
  let end = group.get('end')?.value;
  return end >= start ? null : { 'passwordNotMatch': true };
}
