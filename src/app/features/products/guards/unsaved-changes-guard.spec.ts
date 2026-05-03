import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CanComponentDeactivate, unsavedChangesGuard } from './unsaved-changes-guard';

const run = (component: CanComponentDeactivate) =>
  TestBed.runInInjectionContext(() =>
    unsavedChangesGuard(
      component,
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
      {} as RouterStateSnapshot,
    ),
  );

describe('unsavedChangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(unsavedChangesGuard).toBeTruthy();
  });

  it('should return true when component has no canDeactivate method', () => {
    expect(run({} as CanComponentDeactivate)).toBe(true);
  });

  it('should return true when canDeactivate returns true', () => {
    const component: CanComponentDeactivate = { canDeactivate: vi.fn().mockReturnValue(true) };
    expect(run(component)).toBe(true);
    expect(component.canDeactivate).toHaveBeenCalled();
  });

  it('should return false when canDeactivate returns false', () => {
    const component: CanComponentDeactivate = { canDeactivate: vi.fn().mockReturnValue(false) };
    expect(run(component)).toBe(false);
  });
});
