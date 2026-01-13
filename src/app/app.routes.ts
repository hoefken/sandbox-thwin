import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'trucks',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/trucks/truck-list/truck-list.component').then(
                m => m.TruckListComponent
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/trucks/truck-form/truck-form.component').then(
                m => m.TruckFormComponent
              ),
          },
          {
            path: ':truckId',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./features/trucks/truck-detail/truck-detail.component').then(
                    m => m.TruckDetailComponent
                  ),
              },
              {
                path: 'edit',
                loadComponent: () =>
                  import('./features/trucks/truck-form/truck-form.component').then(
                    m => m.TruckFormComponent
                  ),
              },
              {
                path: 'compartments/new',
                loadComponent: () =>
                  import('./features/trucks/compartment-form/compartment-form.component').then(
                    m => m.CompartmentFormComponent
                  ),
              },
              {
                path: 'compartments/:compartmentId',
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import('./features/trucks/compartment-detail/compartment-detail.component').then(
                        m => m.CompartmentDetailComponent
                      ),
                  },
                  {
                    path: 'edit',
                    loadComponent: () =>
                      import('./features/trucks/compartment-form/compartment-form.component').then(
                        m => m.CompartmentFormComponent
                      ),
                  },
                  {
                    path: 'items/new',
                    loadComponent: () =>
                      import('./features/trucks/item-form/item-form.component').then(
                        m => m.ItemFormComponent
                      ),
                  },
                  {
                    path: 'items/:itemId/edit',
                    loadComponent: () =>
                      import('./features/trucks/item-form/item-form.component').then(
                        m => m.ItemFormComponent
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
