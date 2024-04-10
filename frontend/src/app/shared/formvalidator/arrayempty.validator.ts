import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ArrayEmptyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let array = control as FormArray;
    if (array && array.controls.length > 0) {
      return null;
    } else {
      return { 'arrayEmpty': true };
    }
  }
}
