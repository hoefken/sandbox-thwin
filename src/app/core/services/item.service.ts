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
import { Item, ItemCreate, ItemUpdate } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly firestore = inject(Firestore);
  private readonly itemsCollection = collection(this.firestore, 'items');

  private readonly compartmentFilter = signal<string | null>(null);

  private readonly items$ = toObservable(this.compartmentFilter).pipe(
    switchMap(compartmentId => {
      if (!compartmentId) {
        return [];
      }
      const q = query(
        this.itemsCollection,
        where('compartmentId', '==', compartmentId),
        orderBy('category'),
        orderBy('name')
      );
      return collectionData(q, { idField: 'id' }).pipe(map(docs => docs as Item[]));
    })
  );

  readonly items = toSignal(this.items$, { initialValue: [] });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly itemsCount = computed(() => this.items().length);

  setCompartmentFilter(compartmentId: string | null): void {
    this.compartmentFilter.set(compartmentId);
  }

  async getItem(id: string): Promise<Item | null> {
    const docRef = doc(this.firestore, 'items', id);
    return new Promise(resolve => {
      docData(docRef, { idField: 'id' })
        .pipe(map(data => (data as Item) || null))
        .subscribe({
          next: item => resolve(item),
          error: () => resolve(null),
        });
    });
  }

  async create(data: ItemCreate): Promise<string> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = await addDoc(this.itemsCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, data: ItemUpdate): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(this.firestore, 'items', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
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
      const docRef = doc(this.firestore, 'items', id);
      await deleteDoc(docRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
