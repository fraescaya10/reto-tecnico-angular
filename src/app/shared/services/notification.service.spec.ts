import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no notifications', () => {
    expect(service.notifications()).toHaveLength(0);
  });

  describe('show', () => {
    it('should add a notification with the given message and type', () => {
      service.show('Guardado', 'success');
      expect(service.notifications()).toHaveLength(1);
      expect(service.notifications()[0]).toMatchObject({ message: 'Guardado', type: 'success' });
    });

    it('should default to info type when none is provided', () => {
      service.show('Hola');
      expect(service.notifications()[0].type).toBe('info');
    });

    it('should add multiple notifications independently', () => {
      service.show('First', 'info', 99999);
      service.show('Second', 'error', 99999);
      expect(service.notifications()).toHaveLength(2);
    });

    it('should auto-dismiss after the specified duration', () => {
      service.show('Temporal', 'info', 2000);
      expect(service.notifications()).toHaveLength(1);
      vi.advanceTimersByTime(2000);
      expect(service.notifications()).toHaveLength(0);
    });
  });

  describe('dismiss', () => {
    it('should remove the notification with the matching id', () => {
      service.show('Test', 'success', 99999);
      const id = service.notifications()[0].id;
      service.dismiss(id);
      expect(service.notifications()).toHaveLength(0);
    });

    it('should only remove the targeted notification', () => {
      service.show('First', 'info', 99999);
      vi.advanceTimersByTime(1);
      service.show('Second', 'info', 99999);
      const firstId = service.notifications()[0].id;
      service.dismiss(firstId);
      expect(service.notifications()).toHaveLength(1);
      expect(service.notifications()[0].message).toBe('Second');
    });

    it('should do nothing when id does not match any notification', () => {
      service.show('Keep me', 'info', 99999);
      service.dismiss(-1);
      expect(service.notifications()).toHaveLength(1);
    });
  });
});
