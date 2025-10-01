import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchPasswordValidator(changePass: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // If changing password, new password should match retype
    const pass = (changePass) ? control.get('new')?.value : control.get('password')?.value;
    const retype = control.get('retype')?.value;

    return (pass === retype) ? null : {matchPassword: 'Passwords must match.'};
  };
}