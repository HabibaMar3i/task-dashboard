import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Returns a validation error when a non-empty date is before today. */
export function notPastDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const today = new Date().toISOString().split('T')[0];
  return value < today ? { pastDate: true } : null;
}
