import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class ItemFormComponent implements OnInit {
  truckId = input.required<string>();
  compartmentId = input.required<string>();
  itemId = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditMode = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['', [Validators.required, Validators.maxLength(100)]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    serialNumber: ['', [Validators.maxLength(100)]],
    barcode: ['', [Validators.maxLength(100)]],
    assetTag: ['', [Validators.maxLength(100)]],
  });

  async ngOnInit(): Promise<void> {
    const id = this.itemId();
    if (id) {
      this.isEditMode.set(true);
      this.loading.set(true);

      try {
        const item = await this.itemService.getItem(id);
        if (item) {
          this.form.patchValue({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            serialNumber: item.serialNumber,
            barcode: item.barcode,
            assetTag: item.assetTag,
          });
        } else {
          this.error.set('Item not found');
        }
      } finally {
        this.loading.set(false);
      }
    }
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formData = this.form.getRawValue();

    try {
      const id = this.itemId();
      if (id) {
        await this.itemService.update(id, formData);
      } else {
        await this.itemService.create({
          ...formData,
          truckId: this.truckId(),
          compartmentId: this.compartmentId(),
        });
      }
      this.router.navigate(['/trucks', this.truckId(), 'compartments', this.compartmentId()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save item';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
