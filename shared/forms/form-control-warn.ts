import { FormControl } from '@ngneat/reactive-forms';

export class FormControlWarn<T> extends FormControl<T> {
  public warnings: Record<string, unknown> | undefined;

  public get isWarning(): boolean {
    return this.warnings !== null && this.warnings !== undefined;
  }

  public override updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }) {
    this.warnings = undefined;

    super.updateValueAndValidity(opts);
  }
}
