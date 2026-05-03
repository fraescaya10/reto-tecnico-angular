import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError {
  message = input<string>('');
}
