import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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
    if (this.productForm.valid) {
      console.log('Form submitted', this.productForm.value);
      this.productForm.reset();
    }
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
