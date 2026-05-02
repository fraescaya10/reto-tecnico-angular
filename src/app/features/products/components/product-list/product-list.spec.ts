import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
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
};

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let router: Router;

  beforeEach(async () => {
    vi.useFakeTimers();
    productServiceMock.getProducts.mockReturnValue(of(mockProducts));
    productServiceMock.searchProducts.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceMock },
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

    it('should close the menu', () => {
      component.openMenuId.set('trj-cre');
      component.openEditForm('trj-cre');
      expect(component.openMenuId()).toBeNull();
    });
  });

  describe('closeMenu', () => {
    it('should set openMenuId to null', () => {
      component.openMenuId.set('trj-cre');
      component.closeMenu();
      expect(component.openMenuId()).toBeNull();
    });

    it('should set menuPosition to null', () => {
      component.menuPosition.set({ top: 100, left: 200, placement: 'below' });
      component.closeMenu();
      expect(component.menuPosition()).toBeNull();
    });
  });

  describe('toggleMenu', () => {
    const mockEvent = (bottom = 100, top = 80) =>
      ({
        currentTarget: {
          getBoundingClientRect: () => ({ bottom, top, left: 200 }),
        },
      }) as unknown as MouseEvent;

    it('should open menu for a new id', () => {
      component.toggleMenu('trj-cre', mockEvent());
      expect(component.openMenuId()).toBe('trj-cre');
      expect(component.menuPosition()).not.toBeNull();
    });

    it('should close menu when the same id is toggled again', () => {
      component.openMenuId.set('trj-cre');
      component.toggleMenu('trj-cre', mockEvent());
      expect(component.openMenuId()).toBeNull();
    });

    it('should set placement to above when space below is insufficient', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
      component.toggleMenu('trj-cre', mockEvent(95, 80));
      expect(component.menuPosition()?.placement).toBe('above');
    });

    it('should set placement to below when there is enough space', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      component.toggleMenu('trj-cre', mockEvent(100, 80));
      expect(component.menuPosition()?.placement).toBe('below');
    });
  });

  describe('onDocumentClick', () => {
    it('should close menu when clicking outside actions-cell', () => {
      component.openMenuId.set('trj-cre');
      const event = { target: document.createElement('div') } as unknown as MouseEvent;
      component.onDocumentClick(event);
      expect(component.openMenuId()).toBeNull();
    });

    it('should keep menu open when clicking inside actions-cell', () => {
      component.openMenuId.set('trj-cre');
      const actionsCell = document.createElement('div');
      actionsCell.classList.add('actions-cell');
      const innerBtn = document.createElement('button');
      actionsCell.appendChild(innerBtn);
      const event = { target: innerBtn } as unknown as MouseEvent;
      component.onDocumentClick(event);
      expect(component.openMenuId()).toBe('trj-cre');
    });
  });

  describe('deleteProduct', () => {
    it('should close the menu', () => {
      component.openMenuId.set('trj-cre');
      component.deleteProduct('trj-cre');
      expect(component.openMenuId()).toBeNull();
    });
  });
});
