import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { startWith, debounceTime, distinctUntilChanged, switchMap, Observable, tap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/Product';

interface MenuPosition {
  top: number;
  left: number;
  placement: 'below' | 'above';
}

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  protected readonly ellipsisVertical = faEllipsisVertical;
  protected readonly pencil = faPencil;
  protected readonly trash = faTrash;

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  readonly loading = signal(false);
  readonly pageSize = signal(5);
  readonly pageSizeOptions = [5, 10, 20];
  readonly openMenuId = signal<string | null>(null);
  readonly menuPosition = signal<MenuPosition | null>(null);
  readonly menuHeight = 92;

  products$: Observable<Product[]> = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term: string): Observable<Product[]> => {
      this.loading.set(true);
      return (
        term ? this.productService.searchProducts(term) : this.productService.getProducts()
      ).pipe(tap(() => this.loading.set(false)));
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

  toggleMenu(id: string, event: MouseEvent) {
    if (this.openMenuId() === id) {
      this.closeMenu();
      return;
    }

    this.openMenuId.set(id);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const placement: 'below' | 'above' = spaceBelow < this.menuHeight ? 'above' : 'below';

    this.menuPosition.set({
      top: placement === 'below' ? rect.bottom + 4 : rect.top - this.menuHeight - 4,
      left: rect.left - 100,
      placement,
    });
  }

  closeMenu() {
    this.openMenuId.set(null);
    this.menuPosition.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Element | null;
    const clickedInside = target?.closest('.actions-cell');
    if (!clickedInside) {
      this.closeMenu();
    }
  }

  openEditForm(id: string) {
    this.closeMenu();
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: string) {
    this.closeMenu();
  }
}
