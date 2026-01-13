import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TruckService } from '../../../core/services/truck.service';
import { CompartmentService } from '../../../core/services/compartment.service';
import { Truck, Compartment } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-truck-detail',
  templateUrl: './truck-detail.component.html',
  styleUrl: './truck-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class TruckDetailComponent implements OnInit {
  truckId = input.required<string>();

  private readonly truckService = inject(TruckService);
  private readonly compartmentService = inject(CompartmentService);

  protected readonly truck = signal<Truck | null>(null);
  protected readonly compartments = this.compartmentService.compartments;
  protected readonly loading = signal(true);
  protected readonly deletingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this.truckId();
    this.compartmentService.setTruckFilter(id);

    try {
      const truck = await this.truckService.getTruck(id);
      this.truck.set(truck);
    } finally {
      this.loading.set(false);
    }
  }

  protected async deleteCompartment(compartment: Compartment): Promise<void> {
    if (!confirm(`Delete compartment "${compartment.name}"?`)) {
      return;
    }

    this.deletingId.set(compartment.id);
    try {
      await this.compartmentService.delete(compartment.id);
    } finally {
      this.deletingId.set(null);
    }
  }
}
