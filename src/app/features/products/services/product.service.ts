import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002/bp/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.apiUrl).pipe(map((res) => res.data));
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products: Product[]) => {
        const term = searchTerm.toLowerCase();
        return products.filter((product) => product.name.toLowerCase().includes(term));
      }),
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<{ data: Product }>(this.apiUrl, product).pipe(map((res) => res.data));
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
