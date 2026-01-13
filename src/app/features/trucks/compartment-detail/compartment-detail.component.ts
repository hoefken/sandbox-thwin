import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompartmentService } from '../../../core/services/compartment.service';
import { ItemService } from '../../../core/services/item.service';
import { Compartment, Item } from '../../../core/models/inventory.model';

@Component({
  selector: 'app-compartment-detail',
  templateUrl: './compartment-detail.component.html',
  styleUrl: './compartment-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class CompartmentDetailComponent implements OnInit {
  truckId = input.required<string>();
  compartmentId = input.required<string>();

  private readonly compartmentService = inject(CompartmentService);
  private readonly itemService = inject(ItemService);

  protected readonly compartment = signal<Compartment | null>(null);
  protected readonly items = this.itemService.items;
  protected readonly loading = signal(true);
  protected readonly deletingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const compId = this.compartmentId();
    this.itemService.setCompartmentFilter(compId);

    try {
      const compartment = await this.compartmentService.getCompartment(compId);
      this.compartment.set(compartment);
    } finally {
      this.loading.set(false);
    }
  }

  protected async deleteItem(item: Item): Promise<void> {
    if (!confirm(`Delete item "${item.name}"?`)) {
      return;
    }

    this.deletingId.set(item.id);
    try {
      await this.itemService.delete(item.id);
    } finally {
      this.deletingId.set(null);
    }
  }
}
