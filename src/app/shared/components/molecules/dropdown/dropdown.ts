import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MenuPosition {
  top: number;
  left: number;
  placement: 'below' | 'above';
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  icon = input.required<IconDefinition>();

  isOpen = signal<boolean>(false);
  menuPosition = signal<MenuPosition | null>(null);
  
  private readonly menuHeight = 92; 

  triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  constructor(private elementRef: ElementRef) {}

  toggle(event: MouseEvent) {
    if (this.isOpen()) {
      this.close();
      return;
    }

    const btnElement = this.triggerBtn()?.nativeElement;
    if (!btnElement) return;

    this.isOpen.set(true);
    
    const rect = btnElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const placement: 'below' | 'above' = spaceBelow < this.menuHeight ? 'above' : 'below';

    this.menuPosition.set({
      top: placement === 'below' ? rect.bottom + 4 : rect.top - this.menuHeight - 4,
      left: rect.left - 100,
      placement,
    });
  }

  close() {
    this.isOpen.set(false);
    this.menuPosition.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
