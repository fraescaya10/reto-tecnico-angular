import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ProductList } from './product-list';

const mockProducts: Product[] = [
  {
    id: 'trj-cre',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo bajo línea de crédito',
    logo: 'https://example.com/logo.png',
    date_release: '2027-01-01',
    date_revision: '2028-01-01',
  },
  {
    id: 'trj-deb',
    name: 'Tarjeta de Débito',
    description: 'Tarjeta de débito bancaria principal',
    logo: 'https://example.com/logo2.png',
    date_release: '2027-02-01',
    date_revision: '2028-02-01',
  },
];

const productServiceMock = {
  getProducts: vi.fn().mockReturnValue(of(mockProducts)),
  searchProducts: vi.fn().mockReturnValue(of([])),
  deleteProduct: vi.fn().mockReturnValue(of(void 0)),
};

const confirmDialogServiceMock = {
  open: vi.fn(),
};

const notificationServiceMock = {
  show: vi.fn(),
};

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let router: Router;

  beforeEach(async () => {
    vi.useFakeTimers();
    productServiceMock.getProducts.mockReturnValue(of(mockProducts));
    productServiceMock.searchProducts.mockReturnValue(of([]));
    confirmDialogServiceMock.open.mockReset();
    notificationServiceMock.show.mockReset();

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceMock },
        { provide: ConfirmDialogService, useValue: confirmDialogServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and update productsCount', () => {
    expect(component.productsCount()).toBe(2);
  });

  describe('setPageSize', () => {
    it('should update pageSize signal', () => {
      component.setPageSize(10);
      expect(component.pageSize()).toBe(10);
    });

    it('should update pageSize to 20', () => {
      component.setPageSize(20);
      expect(component.pageSize()).toBe(20);
    });
  });

  describe('paginatedProducts', () => {
    it('should return only pageSize items', () => {
      component.setPageSize(1);
      expect(component.paginatedProducts().length).toBe(1);
    });

    it('should return all products when pageSize exceeds total', () => {
      component.setPageSize(20);
      expect(component.paginatedProducts().length).toBe(2);
    });
  });

  describe('openAddForm', () => {
    it('should navigate to /products/add', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.openAddForm();
      expect(navSpy).toHaveBeenCalledWith(['/products/add']);
    });
  });

  describe('openEditForm', () => {
    it('should navigate to /products/edit/:id', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.openEditForm('trj-cre');
      expect(navSpy).toHaveBeenCalledWith(['/products/edit', 'trj-cre']);
    });
  });

  describe('deleteProduct', () => {
    it('should open a confirmation dialog with product name', () => {
      component.deleteProduct('trj-cre', 'Tarjeta de Crédito');
      expect(confirmDialogServiceMock.open).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Eliminar producto',
          message: '¿Estás seguro de eliminar el producto "Tarjeta de Crédito"?',
          confirmLabel: 'Eliminar',
        }),
      );
    });

    it('should call deleteProduct on service and show success toast on confirm', () => {
      productServiceMock.deleteProduct.mockReturnValue(of(void 0));
      component.deleteProduct('trj-cre', 'Tarjeta de Crédito');
      const { onConfirm } = confirmDialogServiceMock.open.mock.calls[0][0];
      onConfirm();
      expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('trj-cre');
      expect(notificationServiceMock.show).toHaveBeenCalledWith(
        'Producto eliminado correctamente',
        'success',
      );
    });
  });
});
