export type ConfirmationDialogButtonConfig = {
  icon?: string;
  label: string;
  testId?: string;
};

export interface ConfirmationDialogConfig {
  alert: boolean;
  cancel: ConfirmationDialogButtonConfig;
  confirm: ConfirmationDialogButtonConfig;
  content: string;
  title: string;
}
