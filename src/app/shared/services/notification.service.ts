import { Injectable, signal } from '@angular/core';

export type NotificationType = 'error' | 'success' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  show(message: string, type: NotificationType = 'info', duration = 4000): void {
    const id = Date.now();
    this._notifications.update((n) => [...n, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this._notifications.update((n) => n.filter((x) => x.id !== id));
  }
}
