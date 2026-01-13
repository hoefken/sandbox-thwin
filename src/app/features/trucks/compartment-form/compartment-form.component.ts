import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CompartmentService } from '../../../core/services/compartment.service';

@Component({
  selector: 'app-compartment-form',
  templateUrl: './compartment-form.component.html',
  styleUrl: './compartment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class CompartmentFormComponent implements OnInit {
  truckId = input.required<string>();
  compartmentId = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly compartmentService = inject(CompartmentService);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditMode = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    order: [0, [Validators.required, Validators.min(0)]],
  });

  async ngOnInit(): Promise<void> {
    const id = this.compartmentId();
    if (id) {
      this.isEditMode.set(true);
      this.loading.set(true);

      try {
        const compartment = await this.compartmentService.getCompartment(id);
        if (compartment) {
          this.form.patchValue({
            name: compartment.name,
            description: compartment.description,
            order: compartment.order,
          });
        } else {
          this.error.set('Compartment not found');
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
      const id = this.compartmentId();
      if (id) {
        await this.compartmentService.update(id, formData);
      } else {
        await this.compartmentService.create({
          ...formData,
          truckId: this.truckId(),
        });
      }
      this.router.navigate(['/trucks', this.truckId()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save compartment';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
