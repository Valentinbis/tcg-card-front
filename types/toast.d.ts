export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface Toast {
  id: string;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}
