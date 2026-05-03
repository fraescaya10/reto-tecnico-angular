import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly _config = signal<DialogConfig | null>(null);
  readonly config = this._config.asReadonly();

  open(config: DialogConfig): void {
    this._config.set({ confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', ...config });
  }

  confirm(): void {
    this._config()?.onConfirm();
    this._config.set(null);
  }

  cancel(): void {
    const config = this._config();
    config?.onCancel?.();
    this._config.set(null);
  }
}
