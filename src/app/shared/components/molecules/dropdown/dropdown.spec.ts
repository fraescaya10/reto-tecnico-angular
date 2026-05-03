import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from './dropdown';

const mockRect = (bottom = 100, top = 80, left = 200): DOMRect =>
  ({ bottom, top, left, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} }) as DOMRect;

describe('Dropdown', () => {
  let component: Dropdown;
  let fixture: ComponentFixture<Dropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', faEllipsisVertical);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed with no menu position', () => {
    expect(component.isOpen()).toBe(false);
    expect(component.menuPosition()).toBeNull();
  });

  describe('close', () => {
    it('should set isOpen to false and menuPosition to null', () => {
      component.isOpen.set(true);
      component.menuPosition.set({ top: 100, left: 50, placement: 'below' });
      component.close();
      expect(component.isOpen()).toBe(false);
      expect(component.menuPosition()).toBeNull();
    });
  });

  describe('toggle', () => {
    it('should close menu when already open', () => {
      component.isOpen.set(true);
      component.toggle(new MouseEvent('click'));
      expect(component.isOpen()).toBe(false);
    });

    it('should open menu and place below when there is enough space', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      const btn = fixture.nativeElement.querySelector('button');
      vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue(mockRect(100, 80, 200));
      component.toggle(new MouseEvent('click'));
      expect(component.isOpen()).toBe(true);
      expect(component.menuPosition()?.placement).toBe('below');
    });

    it('should place menu above when space below is insufficient', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(105);
      const btn = fixture.nativeElement.querySelector('button');
      vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue(mockRect(100, 80, 200));
      component.toggle(new MouseEvent('click'));
      expect(component.menuPosition()?.placement).toBe('above');
    });

    it('should toggle back to closed when same button is clicked again', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      const btn = fixture.nativeElement.querySelector('button');
      vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue(mockRect());
      component.toggle(new MouseEvent('click'));
      expect(component.isOpen()).toBe(true);
      component.toggle(new MouseEvent('click'));
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('onDocumentClick', () => {
    it('should close when clicking outside the component', () => {
      component.isOpen.set(true);
      const outside = document.createElement('div');
      document.body.appendChild(outside);
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: outside });
      component.onDocumentClick(event);
      expect(component.isOpen()).toBe(false);
      document.body.removeChild(outside);
    });

    it('should stay open when clicking inside the component', () => {
      component.isOpen.set(true);
      const inner = fixture.nativeElement.querySelector('button');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: inner });
      component.onDocumentClick(event);
      expect(component.isOpen()).toBe(true);
    });
  });
});
