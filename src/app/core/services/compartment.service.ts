import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
import { Compartment, CompartmentCreate, CompartmentUpdate } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class CompartmentService {
  private readonly firestore = inject(Firestore);
  private readonly compartmentsCollection = collection(this.firestore, 'compartments');

  private readonly truckFilter = signal<string | null>(null);

  private readonly compartments$ = toObservable(this.truckFilter).pipe(
    switchMap(truckId => {
      if (!truckId) {
        return [];
      }
      const q = query(
        this.compartmentsCollection,
        where('truckId', '==', truckId),
        orderBy('order'),
        orderBy('name')
      );
      return collectionData(q, { idField: 'id' }).pipe(map(docs => docs as Compartment[]));
    })
  );

  readonly compartments = toSignal(this.compartments$, { initialValue: [] });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly compartmentsCount = computed(() => this.compartments().length);

  setTruckFilter(truckId: string | null): void {
    this.truckFilter.set(truckId);
  }

  async getCompartment(id: string): Promise<Compartment | null> {
    const docRef = doc(this.firestore, 'compartments', id);
    return new Promise(resolve => {
      docData(docRef, { idField: 'id' })
        .pipe(map(data => (data as Compartment) || null))
        .subscribe({
          next: compartment => resolve(compartment),
          error: () => resolve(null),
        });
    });
  }

  async create(data: CompartmentCreate): Promise<string> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = await addDoc(this.compartmentsCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create compartment';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, data: CompartmentUpdate): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(this.firestore, 'compartments', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update compartment';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(this.firestore, 'compartments', id);
      await deleteDoc(docRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete compartment';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
