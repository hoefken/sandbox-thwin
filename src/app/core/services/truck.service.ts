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
  orderBy,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Truck, TruckCreate, TruckUpdate } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class TruckService {
  private readonly firestore = inject(Firestore);
  private readonly trucksCollection = collection(this.firestore, 'trucks');

  private readonly trucksQuery = query(this.trucksCollection, orderBy('name'));

  private readonly trucks$ = collectionData(this.trucksQuery, { idField: 'id' }).pipe(
    map(docs => docs as Truck[])
  );

  readonly trucks = toSignal(this.trucks$, { initialValue: [] });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly trucksCount = computed(() => this.trucks().length);

  async getTruck(id: string): Promise<Truck | null> {
    const docRef = doc(this.firestore, 'trucks', id);
    return new Promise(resolve => {
      docData(docRef, { idField: 'id' })
        .pipe(map(data => (data as Truck) || null))
        .subscribe({
          next: truck => resolve(truck),
          error: () => resolve(null),
        });
    });
  }

  async create(data: TruckCreate): Promise<string> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = await addDoc(this.trucksCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create truck';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, data: TruckUpdate): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(this.firestore, 'trucks', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update truck';
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
      const docRef = doc(this.firestore, 'trucks', id);
      await deleteDoc(docRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete truck';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
