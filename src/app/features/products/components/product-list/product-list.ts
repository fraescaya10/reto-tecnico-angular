import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly router = inject(Router);
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  readonly loading = signal(false);
  readonly pageSize = signal(10);
  readonly pageSizeOptions = [5, 10, 15];

  products = [
    {
      id: 'trj-crd-001',
      name: 'Tarjeta de Crédito Visa Signature',
      description:
        'Tarjeta de crédito premium con cashback del 2% y acceso a salas VIP en aeropuertos.',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
    {
      id: 'cta-aho-002',
      name: 'Cuenta de Ahorros Plus',
      description:
        'Cuenta de ahorros con tasa preferencial del 4.5% anual y sin comisiones de mantenimiento.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/BancoPichincha.svg/200px-BancoPichincha.svg.png',
      date_release: '2025-03-15',
      date_revision: '2026-03-15',
    },
    {
      id: 'prs-per-003',
      name: 'Préstamo Personal Flexible',
      description:
        'Crédito personal hasta $50,000 con plazos de hasta 60 meses y tasa fija competitiva.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Produbanco_logo.png/200px-Produbanco_logo.png',
      date_release: '2025-04-01',
      date_revision: '2026-04-01',
    },
    {
      id: 'seg-vid-004',
      name: 'Seguro de Vida Integral',
      description:
        'Protección de vida con cobertura de hasta $200,000 e incluye asistencia médica internacional.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Equinoccial.png/200px-Equinoccial.png',
      date_release: '2025-01-10',
      date_revision: '2026-01-10',
    },
    {
      id: 'fdo-inv-005',
      name: 'Fondo de Inversión Dinámico',
      description:
        'Portafolio diversificado con acceso a mercados internacionales y rentabilidad variable.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Banco_del_Pacífico_logo.png/200px-Banco_del_Pacífico_logo.png',
      date_release: '2025-05-20',
      date_revision: '2026-05-20',
    },
    {
      id: 'dbt-mst-006',
      name: 'Débito Mastercard Business',
      description:
        'Tarjeta de débito empresarial con límites ampliados, reportes y gestión de gastos.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
      date_release: '2025-06-01',
      date_revision: '2026-06-01',
    },
    {
      id: 'hip-viv-007',
      name: 'Hipoteca Vivienda VIP',
      description:
        'Crédito hipotecario para vivienda de interés público con tasa desde el 4.99% anual.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/BancoPichincha.svg/200px-BancoPichincha.svg.png',
      date_release: '2025-07-01',
      date_revision: '2026-07-01',
    },
    {
      id: 'pla-fix-008',
      name: 'Plazo Fijo Rentable',
      description:
        'Depósito a plazo fijo desde 30 días con tasas de hasta 7% anual y pago de intereses mensual.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Produbanco_logo.png/200px-Produbanco_logo.png',
      date_release: '2025-08-15',
      date_revision: '2026-08-15',
    },
    {
      id: 'test-prod',
      name: 'Producto test',
      description: 'Este es un producto de test',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/OnStar_logo.svg/960px-OnStar_logo.svg.png',
      date_release: '2026-05-09',
      date_revision: '2027-05-09',
    },
  ];

  setPageSize(arg0: number) {
    console.log(arg0);
  }

  openAddForm() {
    this.router.navigate(['/products/add']);
  }
}
