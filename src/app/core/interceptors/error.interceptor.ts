import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message: string =
        err.error?.message ?? 'Error inesperado. Por favor, intente de nuevo.';
      notifications.show(message, 'error');
      return throwError(() => err);
    }),
  );
};
