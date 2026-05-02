import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';

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
  private readonly productService = inject(ProductService);

  readonly loading = signal(false);

  productForm = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required, this.urlValidator]],
    date_release: ['', [Validators.required, this.minDateTodayValidator]],
    date_revision: [{ value: '', disabled: true }, Validators.required],
  });

  constructor() {
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

    this.productService.createProduct(product).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse.error.message);
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    console.log('Cancel clicked');
    this.productForm.reset();
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
