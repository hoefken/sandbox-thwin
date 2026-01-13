import { Timestamp } from '@angular/fire/firestore';

export interface Truck {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Compartment {
  id: string;
  truckId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  serialNumber: string;
  barcode: string;
  assetTag: string;
  truckId: string;
  compartmentId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TruckCreate = Pick<Truck, 'name' | 'description'>;
export type TruckUpdate = Partial<TruckCreate>;

export type CompartmentCreate = Pick<Compartment, 'truckId' | 'name' | 'description' | 'order'>;
export type CompartmentUpdate = Partial<Omit<CompartmentCreate, 'truckId'>>;

export type ItemCreate = Pick<
  Item,
  | 'name'
  | 'category'
  | 'quantity'
  | 'serialNumber'
  | 'barcode'
  | 'assetTag'
  | 'truckId'
  | 'compartmentId'
>;
export type ItemUpdate = Partial<Omit<ItemCreate, 'truckId' | 'compartmentId'>>;
