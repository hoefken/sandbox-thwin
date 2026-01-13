import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TruckService } from '../../../core/services/truck.service';
import { Truck } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-truck-list',
  templateUrl: './truck-list.component.html',
  styleUrl: './truck-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class TruckListComponent {
  private readonly truckService = inject(TruckService);

  protected readonly trucks = this.truckService.trucks;
  protected readonly loading = this.truckService.loading;
  protected readonly deletingId = signal<string | null>(null);

  protected async deleteTruck(truck: Truck): Promise<void> {
    if (!confirm(`Delete truck "${truck.name}"?`)) {
      return;
    }

    this.deletingId.set(truck.id);
    try {
      await this.truckService.delete(truck.id);
    } finally {
      this.deletingId.set(null);
    }
  }
}
