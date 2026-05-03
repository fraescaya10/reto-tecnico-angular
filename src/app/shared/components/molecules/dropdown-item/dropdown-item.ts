import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DropdownItemVariant = 'default' | 'danger';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-item.html',
  styleUrl: './dropdown-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownItem {
  variant = input<DropdownItemVariant>('default');
}
