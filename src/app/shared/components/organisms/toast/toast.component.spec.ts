import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from '../../../services/notification.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render nothing when there are no notifications', () => {
    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });

  it('should render a toast for each notification', () => {
    notificationService.show('Mensaje 1', 'info', 99999);
    notificationService.show('Mensaje 2', 'success', 99999);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast')).toHaveLength(2);
  });

  it('should display the notification message', () => {
    notificationService.show('Operación exitosa', 'success', 99999);
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.toast__message');
    expect(msg.textContent.trim()).toBe('Operación exitosa');
  });

  it('should apply the correct type CSS class', () => {
    notificationService.show('Error', 'error', 99999);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast--error')).not.toBeNull();
  });

  it('should dismiss notification when close button is clicked', () => {
    notificationService.show('Cerrar esto', 'info', 99999);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.toast__close') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });
});
