import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { ProductForm } from './product-form';

const mockProduct: Product = {
  id: 'trj-cre',
  name: 'Tarjeta de Crédito',
  description: 'Tarjeta de consumo bajo línea de crédito',
  logo: 'https://example.com/logo.png',
  date_release: '2027-01-01',
  date_revision: '2028-01-01',
};

const validFormValue = {
  id: 'abc',
  name: 'Nombre válido',
  description: 'Descripción válida con más de 10 chars',
  logo: 'https://example.com/logo.png',
  date_release: '2027-01-01',
  date_revision: '2028-01-01',
};

function buildServiceMock() {
  return {
    getProductById: vi.fn().mockReturnValue(of(mockProduct)),
    createProduct: vi.fn().mockReturnValue(of(mockProduct)),
    updateProduct: vi.fn().mockReturnValue(of(mockProduct)),
  };
}

function buildProviders(routeId: string | null, serviceMock: ReturnType<typeof buildServiceMock>) {
  return [
    provideRouter([]),
    { provide: ProductService, useValue: serviceMock },
    { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => routeId } } } },
  ];
}

describe('ProductForm', () => {
  describe('Add mode', () => {
    let component: ProductForm;
    let fixture: ComponentFixture<ProductForm>;
    let router: Router;
    let serviceMock: ReturnType<typeof buildServiceMock>;

    beforeEach(async () => {
      serviceMock = buildServiceMock();

      await TestBed.configureTestingModule({
        imports: [ProductForm],
        providers: buildProviders(null, serviceMock),
      }).compileComponents();

      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(ProductForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('should be in add mode', () => expect(component.isEditMode()).toBe(false));

    it('form should be invalid when empty', () => {
      expect(component.productForm.invalid).toBe(true);
    });

    it('id should have required error when empty', () => {
      component.productForm.controls.id.markAsTouched();
      expect(component.productForm.controls.id.hasError('required')).toBe(true);
    });

    it('id should have minlength error with 2 chars', () => {
      component.productForm.controls.id.setValue('ab');
      expect(component.productForm.controls.id.hasError('minlength')).toBe(true);
    });

    it('id should have maxlength error with 11 chars', () => {
      component.productForm.controls.id.setValue('abcdefghijk');
      expect(component.productForm.controls.id.hasError('maxlength')).toBe(true);
    });

    it('logo should have invalidUrl error for non-URL value', () => {
      component.productForm.controls.logo.setValue('not-a-url');
      expect(component.productForm.controls.logo.hasError('invalidUrl')).toBe(true);
    });

    it('logo should be valid for a well-formed URL', () => {
      component.productForm.controls.logo.setValue('https://example.com/logo.png');
      expect(component.productForm.controls.logo.valid).toBe(true);
    });

    it('date_release should have minDateToday error for a past date', () => {
      component.productForm.controls.date_release.setValue('2020-01-01');
      expect(component.productForm.controls.date_release.hasError('minDateToday')).toBe(true);
    });

    it('date_revision should auto-calculate one year after date_release', () => {
      component.productForm.controls.date_release.setValue('2027-06-15');
      expect(component.productForm.controls.date_revision.value).toBe('2028-06-15');
    });

    it('date_revision should clear when date_release is cleared', () => {
      component.productForm.controls.date_release.setValue('2027-01-01');
      component.productForm.controls.date_release.setValue('');
      expect(component.productForm.controls.date_revision.value).toBe('');
    });

    it('onSubmit should not call createProduct when form is invalid', () => {
      component.onSubmit();
      expect(serviceMock.createProduct).not.toHaveBeenCalled();
    });

    it('onSubmit should not call createProduct when loading is true', () => {
      component.loading.set(true);
      component.onSubmit();
      expect(serviceMock.createProduct).not.toHaveBeenCalled();
    });

    it('onSubmit should call createProduct and navigate to /products on success', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.productForm.setValue(validFormValue);
      component.onSubmit();
      expect(serviceMock.createProduct).toHaveBeenCalled();
      expect(navSpy).toHaveBeenCalledWith(['/products']);
      expect(component.loading()).toBe(false);
    });

    it('onSubmit should set loading to false on error', () => {
      const error = new HttpErrorResponse({ error: { message: 'Server error' }, status: 400 });
      serviceMock.createProduct.mockReturnValue(throwError(() => error));
      component.productForm.setValue(validFormValue);
      component.onSubmit();
      expect(component.loading()).toBe(false);
    });

    it('onReset should clear the form', () => {
      component.productForm.controls.id.setValue('abc');
      component.onReset();
      expect(component.productForm.controls.id.value).toBeFalsy();
    });

    it('goBack should navigate to /products', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.goBack();
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Edit mode', () => {
    let component: ProductForm;
    let fixture: ComponentFixture<ProductForm>;
    let router: Router;
    let serviceMock: ReturnType<typeof buildServiceMock>;

    beforeEach(async () => {
      serviceMock = buildServiceMock();

      await TestBed.configureTestingModule({
        imports: [ProductForm],
        providers: buildProviders('trj-cre', serviceMock),
      }).compileComponents();

      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(ProductForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create in edit mode', () => expect(component).toBeTruthy());

    it('should set isEditMode to true', () => expect(component.isEditMode()).toBe(true));

    it('should patch product data into the form', () => {
      expect(component.productForm.controls.name.value).toBe(mockProduct.name);
      expect(component.productForm.controls.description.value).toBe(mockProduct.description);
    });

    it('id field should be disabled', () => {
      expect(component.productForm.controls.id.disabled).toBe(true);
    });

    it('onSubmit should call updateProduct with the original editId', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(serviceMock.updateProduct).toHaveBeenCalledWith(
        'trj-cre',
        expect.objectContaining({ id: 'trj-cre' }),
      );
      expect(navSpy).toHaveBeenCalledWith(['/products']);
    });

    it('onReset should restore original product values', () => {
      component.productForm.controls.name.setValue('Nombre modificado');
      component.onReset();
      expect(component.productForm.controls.name.value).toBe(mockProduct.name);
    });

    it('onReset should mark form as pristine and untouched', () => {
      component.productForm.controls.name.markAsDirty();
      component.onReset();
      expect(component.productForm.pristine).toBe(true);
      expect(component.productForm.untouched).toBe(true);
    });
  });

  describe('canDeactivate', () => {
    let component: ProductForm;
    let fixture: ComponentFixture<ProductForm>;
    let confirmDialogService: ConfirmDialogService;
    let router: Router;

    beforeEach(async () => {
      const serviceMock = buildServiceMock();

      await TestBed.configureTestingModule({
        imports: [ProductForm],
        providers: buildProviders(null, serviceMock),
      }).compileComponents();

      router = TestBed.inject(Router);
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      fixture = TestBed.createComponent(ProductForm);
      component = fixture.componentInstance;
      confirmDialogService = TestBed.inject(ConfirmDialogService);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should return true when form is pristine', () => {
      expect(component.canDeactivate()).toBe(true);
    });

    it('should return true after a successful submit', () => {
      component.productForm.setValue(validFormValue);
      component.onSubmit();
      expect(component.canDeactivate()).toBe(true);
    });

    it('should return an Observable when form is dirty and not submitted', () => {
      component.productForm.markAsDirty();
      const result = component.canDeactivate();
      expect(result).toBeInstanceOf(Observable);
    });

    it('observable should emit true when user confirms', () =>
      new Promise<void>((resolve) => {
        component.productForm.markAsDirty();
        (component.canDeactivate() as Observable<boolean>).subscribe((value) => {
          expect(value).toBe(true);
          resolve();
        });
        confirmDialogService.confirm();
      }));

    it('observable should emit false when user cancels', () =>
      new Promise<void>((resolve) => {
        component.productForm.markAsDirty();
        (component.canDeactivate() as Observable<boolean>).subscribe((value) => {
          expect(value).toBe(false);
          resolve();
        });
        confirmDialogService.cancel();
      }));
  });

  describe('Edit mode — getProductById error', () => {
    it('should set loading to false when getProductById fails', async () => {
      const errorSpy = buildServiceMock();
      const error = new HttpErrorResponse({ error: { message: 'Not found' }, status: 404 });
      errorSpy.getProductById.mockReturnValue(throwError(() => error));

      await TestBed.configureTestingModule({
        imports: [ProductForm],
        providers: buildProviders('bad-id', errorSpy),
      }).compileComponents();

      const f = TestBed.createComponent(ProductForm);
      f.detectChanges();
      await f.whenStable();

      expect(f.componentInstance.loading()).toBe(false);
    });
  });
});
