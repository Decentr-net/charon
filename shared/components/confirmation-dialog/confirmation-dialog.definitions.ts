export type ConfirmationDialogButtonConfig = {
  icon?: string;
  label: string;
};

export interface ConfirmationDialogConfig {
  alert: boolean;
  cancel: ConfirmationDialogButtonConfig;
  confirm: ConfirmationDialogButtonConfig;
  content: string;
  title: string;
}
