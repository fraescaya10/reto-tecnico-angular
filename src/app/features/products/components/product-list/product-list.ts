import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Observable,
  tap,
  catchError,
  of,
  Subject,
  combineLatest,
  map,
} from 'rxjs';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/Product';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { NotificationService } from '../../../../shared/services/notification.service';

import { Button } from '../../../../shared/components/atoms/button/button';
import { Input } from '../../../../shared/components/atoms/input/input';
import { Dropdown } from '../../../../shared/components/molecules/dropdown/dropdown';
import { DropdownItem } from '../../../../shared/components/molecules/dropdown-item/dropdown-item';

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule, FontAwesomeModule, Button, Input, Dropdown, DropdownItem],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  private readonly refresh$ = new Subject<void>();

  protected readonly ellipsisVertical = faEllipsisVertical;
  protected readonly pencil = faPencil;
  protected readonly trash = faTrash;

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  readonly loading = signal(true);
  readonly pageSize = signal(5);
  readonly pageSizeOptions = [5, 10, 20];

  products$: Observable<Product[]> = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
    this.refresh$.pipe(startWith(null)),
  ]).pipe(
    map(([term]) => term),
    switchMap((term: string): Observable<Product[]> => {
      this.loading.set(true);
      return (
        term ? this.productService.searchProducts(term) : this.productService.getProducts()
      ).pipe(
        tap(() => this.loading.set(false)),
        catchError(() => {
          this.loading.set(false);
          return of([]);
        }),
      );
    }),
  );

  products = toSignal(this.products$, {
    initialValue: [] as Product[],
  });

  productsCount = computed(() => (this.products() ?? []).length);
  paginatedProducts = computed(() => this.products().slice(0, this.pageSize()));

  setPageSize(size: number) {
    this.pageSize.set(size);
  }

  openAddForm() {
    this.router.navigate(['/products/add']);
  }

  openEditForm(id: string) {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: string, productName: string) {
    this.confirmDialogService.open({
      title: 'Eliminar producto',
      message: `¿Estás seguro de eliminar el producto "${productName}"?`,
      confirmLabel: 'Eliminar',
      onConfirm: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.notificationService.show('Producto eliminado correctamente', 'success');
            this.refresh$.next();
          },
        });
      },
    });
  }
}
