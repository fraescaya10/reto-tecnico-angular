import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
    // canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
    // resolve: { product: productResolver },
    // canDeactivate: [unsavedChangesGuard],
  },
];
