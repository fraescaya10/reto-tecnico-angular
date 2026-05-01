import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
  },
  // {
  //   path: 'add',
  //   loadComponent: () =>
  //     import('./components/product-form/product-form.component').then(
  //       (m) => m.ProductFormComponent
  //     ),
  //   canDeactivate: [unsavedChangesGuard],
  // },
  // {
  //   path: 'edit/:id',
  //   loadComponent: () =>
  //     import('./components/product-form/product-form.component').then(
  //       (m) => m.ProductFormComponent
  //     ),
  //   resolve: { product: productResolver },
  //   canDeactivate: [unsavedChangesGuard],
  // },
];
