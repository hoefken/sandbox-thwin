import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';

@Component({
  selector: 'app-truck-form',
  templateUrl: './truck-form.component.html',
  styleUrl: './truck-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class TruckFormComponent implements OnInit {
  truckId = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly truckService = inject(TruckService);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditMode = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  async ngOnInit(): Promise<void> {
    const id = this.truckId();
    if (id) {
      this.isEditMode.set(true);
      this.loading.set(true);

      try {
        const truck = await this.truckService.getTruck(id);
        if (truck) {
          this.form.patchValue({
            name: truck.name,
            description: truck.description,
          });
        } else {
          this.error.set('Truck not found');
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

    const data = this.form.getRawValue();

    try {
      const id = this.truckId();
      if (id) {
        await this.truckService.update(id, data);
      } else {
        await this.truckService.create(data);
      }
      this.router.navigate(['/trucks']);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save truck';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
