import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogService: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(ConfirmDialogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render overlay when no dialog is open', () => {
    expect(fixture.nativeElement.querySelector('.dialog-overlay')).toBeNull();
  });

  it('should render overlay when dialog is open', () => {
    dialogService.open({ title: 'Confirmar', message: '¿Seguro?', onConfirm: vi.fn() });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dialog-overlay')).not.toBeNull();
  });

  it('should display the dialog message', () => {
    dialogService.open({ title: 'T', message: '¿Deseas continuar?', onConfirm: vi.fn() });
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.dialog-card__message');
    expect(msg.textContent.trim()).toBe('¿Deseas continuar?');
  });

  it('should hide title when title is "Eliminar producto"', () => {
    dialogService.open({ title: 'Eliminar producto', message: 'M', onConfirm: vi.fn() });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dialog-card__title')).toBeNull();
  });

  it('should show title when it is not "Eliminar producto"', () => {
    dialogService.open({ title: 'Confirmar acción', message: 'M', onConfirm: vi.fn() });
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.dialog-card__title');
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe('Confirmar acción');
  });

  describe('onEscape', () => {
    it('should call cancel when a dialog is open', () => {
      const cancelSpy = vi.spyOn(dialogService, 'cancel');
      dialogService.open({ title: 'T', message: 'M', onConfirm: vi.fn() });
      component.onEscape();
      expect(cancelSpy).toHaveBeenCalledOnce();
    });

    it('should not call cancel when no dialog is open', () => {
      const cancelSpy = vi.spyOn(dialogService, 'cancel');
      component.onEscape();
      expect(cancelSpy).not.toHaveBeenCalled();
    });
  });

  it('should call confirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    dialogService.open({ title: 'T', message: 'M', onConfirm });
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    (buttons[1] as HTMLElement).click();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('should call cancel when cancel button is clicked', () => {
    const cancelSpy = vi.spyOn(dialogService, 'cancel');
    dialogService.open({ title: 'T', message: 'M', onConfirm: vi.fn() });
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    (buttons[0] as HTMLElement).click();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should call cancel when clicking the overlay backdrop', () => {
    const cancelSpy = vi.spyOn(dialogService, 'cancel');
    dialogService.open({ title: 'T', message: 'M', onConfirm: vi.fn() });
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.dialog-overlay') as HTMLElement).click();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
