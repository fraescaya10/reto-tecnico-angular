import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(false);
  readonly isEditMode = signal(false);
  private editId: string | null = null;
  private originalProduct: Product | null = null;

  productForm = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required, this.urlValidator]],
    date_release: ['', [Validators.required, this.minDateTodayValidator]],
    date_revision: [{ value: '', disabled: true }, Validators.required],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.productForm.controls.id.disable();
      this.loading.set(true);

      this.productService
        .getProductById(id)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: (product) => {
            this.editId = product.id;
            this.originalProduct = product;
            this.productForm.patchValue(product);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          },
        });
    }

    this.productForm.controls.date_release.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value) {
          const release = new Date(value + 'T00:00:00');
          release.setFullYear(release.getFullYear() + 1);
          const revision = release.toISOString().split('T')[0];
          this.productForm.controls.date_revision.setValue(revision, { emitEvent: false });
        } else {
          this.productForm.controls.date_revision.setValue('', { emitEvent: false });
        }
      });
  }

  onSubmit() {
    if (this.productForm.invalid || this.loading()) return;

    const product = this.productForm.getRawValue() as Product;
    this.loading.set(true);

    const request$ =
      this.isEditMode() && this.editId
        ? this.productService.updateProduct(this.editId, { ...product, id: this.editId })
        : this.productService.createProduct(product);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        const msg = this.isEditMode() ? 'Producto actualizado correctamente' : 'Producto creado correctamente';
        this.notificationService.show(msg, 'success');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onReset() {
    if (this.isEditMode() && this.originalProduct) {
      this.productForm.patchValue(this.originalProduct);
      this.productForm.markAsPristine();
      this.productForm.markAsUntouched();
    } else {
      this.productForm.reset();
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  private minDateTodayValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(control.value + 'T00:00:00');
    return selected < today ? { minDateToday: true } : null;
  }
}
