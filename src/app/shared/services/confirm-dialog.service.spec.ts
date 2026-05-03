import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null config by default', () => {
    expect(service.config()).toBeNull();
  });

  describe('open', () => {
    it('should set config with provided values and default labels', () => {
      const onConfirm = vi.fn();
      service.open({ title: 'Test', message: 'Are you sure?', onConfirm });
      expect(service.config()).toMatchObject({
        title: 'Test',
        message: 'Are you sure?',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm,
      });
    });

    it('should override default labels when provided', () => {
      service.open({ title: 'T', message: 'M', confirmLabel: 'Sí', cancelLabel: 'No', onConfirm: vi.fn() });
      expect(service.config()?.confirmLabel).toBe('Sí');
      expect(service.config()?.cancelLabel).toBe('No');
    });
  });

  describe('confirm', () => {
    it('should invoke onConfirm callback and clear config', () => {
      const onConfirm = vi.fn();
      service.open({ title: 'T', message: 'M', onConfirm });
      service.confirm();
      expect(onConfirm).toHaveBeenCalledOnce();
      expect(service.config()).toBeNull();
    });

    it('should not throw when no config is set', () => {
      expect(() => service.confirm()).not.toThrow();
    });
  });

  describe('cancel', () => {
    it('should clear the config', () => {
      service.open({ title: 'T', message: 'M', onConfirm: vi.fn() });
      service.cancel();
      expect(service.config()).toBeNull();
    });
  });
});
