import { FormControl } from '@ngneat/reactive-forms';

export class FormControlWarn<T> extends FormControl<T> {
  public warnings: Record<string, any> | undefined;

  public get isWarning(): boolean {
    return this.warnings !== null && this.warnings !== undefined;
  }
}
