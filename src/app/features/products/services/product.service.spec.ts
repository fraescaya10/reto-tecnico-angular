import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../models/Product';
import { ProductService } from './product.service';

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

const API_URL = 'http://localhost:3002/bp/products';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products array extracted from data property', () => {
      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });
      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });
    });
  });

  describe('searchProducts', () => {
    it('should filter products by name case-insensitively', () => {
      service.searchProducts('crédito').subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products[0].id).toBe('trj-cre');
      });
      httpMock.expectOne(API_URL).flush({ data: mockProducts });
    });

    it('should return all products when term matches all', () => {
      service.searchProducts('tarjeta').subscribe((products) => {
        expect(products.length).toBe(2);
      });
      httpMock.expectOne(API_URL).flush({ data: mockProducts });
    });

    it('should return empty array when no product matches', () => {
      service.searchProducts('xyz-no-match').subscribe((products) => {
        expect(products.length).toBe(0);
      });
      httpMock.expectOne(API_URL).flush({ data: mockProducts });
    });
  });

  describe('getProductById', () => {
    it('should GET a single product by id', () => {
      service.getProductById('trj-cre').subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });
      const req = httpMock.expectOne(`${API_URL}/trj-cre`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts[0]);
    });
  });

  describe('createProduct', () => {
    it('should POST and return created product from data property', () => {
      service.createProduct(mockProducts[0]).subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });
      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProducts[0]);
      req.flush({ data: mockProducts[0] });
    });
  });

  describe('updateProduct', () => {
    it('should PUT and return the updated product', () => {
      service.updateProduct('trj-cre', mockProducts[0]).subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });
      const req = httpMock.expectOne(`${API_URL}/trj-cre`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProducts[0]);
      req.flush(mockProducts[0]);
    });
  });

  describe('deleteProduct', () => {
    it('should DELETE the product by id', () => {
      let completed = false;
      service.deleteProduct('trj-cre').subscribe({ complete: () => (completed = true) });
      const req = httpMock.expectOne(`${API_URL}/trj-cre`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      expect(completed).toBe(true);
    });
  });
});
